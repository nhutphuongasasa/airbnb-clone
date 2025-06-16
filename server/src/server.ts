import express, { NextFunction, request, Request, Response } from 'express';
import dotenv from 'dotenv'
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import {Strategy as GithubStrategy} from 'passport-github'
import prisma from './shared/lib/prismaDB';
import cookieParser from 'cookie-parser';
import { generateAccessToken, generateAccessTokenFromRefreshToken, generateRefreshToken } from './shared/lib/genToken';
import { setupUserModule } from './modules/user';
import { setupListingModule } from './modules/listing';
import { errorHandler } from './shared/middleware/exception';
import { setupGithubStrategy, setupGoogleStrategy } from './shared/middleware/strategy';
import { setupAuthModule } from './modules/auth';
import { reservationsUseCase, setupReservationModule } from './modules/reservation';
import crypto from "crypto";
import qs from "qs";
import config from 'config';
import { IncomingHttpHeaders } from 'http';
import moment from 'moment'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, VerifyIpnCall, HashAlgorithm, consoleLogger, IpnSuccess, VerifyReturnUrl, IpnFailChecksum, IpnUnknownError, IpnOrderNotFound, IpnInvalidAmount, InpOrderAlreadyConfirmed, ReturnQueryFromVNPay } from 'vnpay';
import { promises } from 'dns';
// import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()

app.use(cors({
    // origin: process.env.CLIENT_URL,
    origin: true, // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(cookieParser())

app.use(express.json())


setupGithubStrategy()
setupGoogleStrategy()

app.use(passport.initialize())


const vnpay = new VNPay({
  tmnCode: 'GQMN02JF',
  secureSecret: 'VZNYNF7L6KC6PKKQX3TOF98GAQ3PJHAC',
  vnpayHost: 'https://sandbox.vnpayment.vn',
  queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', // tùy chọn, trường hợp khi url của querydr và refund khác với url khởi tạo thanh toán (thường sẽ sử dụng cho production)

  testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
  // hashAlgorithm: 'SHA512', // tùy chọn
  // hashAlgorithm: 'sha512',
  hashAlgorithm: HashAlgorithm.SHA512,


  enableLog: true, // tùy chọn

  loggerFn: ignoreLogger, // tùy chọn

  endpoints: {
      paymentEndpoint: 'paymentv2/vpcpay.html',
      queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
      getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
  }, // tùy chọn
});


const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);


app.get('/api/create-qr', async (req, res) => {

  const { userId, listingId, startDate, endDate, totalPrice } = req.body

  const useCase = reservationsUseCase()
  const reservation = await useCase.create({
    userId, listingId, startDate, endDate, totalPrice
  })

  // Tạo URL thanh toán
  const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: 10*1000,
      vnp_IpAddr:
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        req.ip ||
        '127.0.0.1',
      vnp_TxnRef: reservation.id,
      vnp_OrderInfo: `Thanh toan don hang `,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'http://localhost:3000/api/vnpay_return', // Đường dẫn nên là của frontend
      vnp_Locale: VnpLocale.VN,
  });

  return res.redirect(paymentUrl);
});

app.get('/api/vnpay_ipn', async (req: Request, res: Response): Promise<any> => {
  try {
      const quey = req.query as ReturnQueryFromVNPay
      const verify: VerifyReturnUrl = vnpay.verifyIpnCall(quey);

      if (!verify.isVerified) {
          return res.json(IpnFailChecksum);
      }

      if (!verify.isSuccess) {
          return res.json(IpnUnknownError);
      }

      // // // Tìm đơn hàng trong cơ sở dữ liệu
      // const foundOrder = await findOrderById(verify.vnp_TxnRef); // Phương thức tìm đơn hàng theo id, bạn cần tự triển khai

      // // Nếu không tìm thấy đơn hàng hoặc mã đơn hàng không khớp
      // if (!foundOrder || verify.vnp_TxnRef !== foundOrder.orderId) {
      //     return res.json(IpnOrderNotFound);
      // }

      // // // Nếu số tiền thanh toán không khớp
      // if (verify.vnp_Amount !== foundOrder.amount) {
      //     return res.json(IpnInvalidAmount);
      // }

      // // // Nếu đơn hàng đã được xác nhận trước đó
      // if (foundOrder.status === 'completed') {
      //     return res.json(InpOrderAlreadyConfirmed);
      // }

      // /**
      //  * Sau khi xác thực đơn hàng thành công,
      //  * bạn có thể cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
      //  */
      // foundOrder.status = 'completed';
      // await updateOrder(foundOrder); // Hàm cập nhật trạng thái đơn hàng, bạn cần tự triển khai

      await prisma.payment.create({
        data: {
          // userId: "abc123", // ID người dùng thực tế
          orderId: "12345678", // vnp_TxnRef
          amount: 1000000, // VND
          orderInfo: "Thanh toan don hang ABC", // vnp_OrderInfo
          bankCode: "NCB", // vnp_BankCode
          payDate: "20250616123000", // vnp_PayDate (format yyyyMMddHHmmss)
          transactionNo: "VNP123456789", // vnp_TransactionNo (unique)
          cardType: "ATM", // vnp_CardType
          status: "SUCCESS", // hoặc "FAILED"
        },
      });
      
      return res.json(IpnSuccess);
    
    } catch (error) {
      /**
       * Xử lý các ngoại lệ
       * Ví dụ: dữ liệu không đủ, dữ liệu không hợp lệ, lỗi cập nhật cơ sở dữ liệu
       */
      console.log(`verify error: ${error}`);
      return res.json(IpnUnknownError);
  }
});






// function sortObject(obj: Record<string, string>) {
//     const sorted = Object.keys(obj).sort().reduce((result: any, key) => {
//       result[key] = obj[key];
//       return result;
//     }, {});
//     return sorted;
//   }

//   app.post('/api/create-qr', async (req: Request, res: Response): Promise<any> => {
//     try {
//       // Đặt múi giờ
//       process.env.TZ = 'Asia/Ho_Chi_Minh';
  
//       // Kiểm tra biến môi trường
//       const tmnCode = process.env.VNP_TMNCODE;
//       const secureSecret = process.env.VNP_HASHSECRET;
//       if (!tmnCode || !secureSecret) {
//         return res.status(500).json({ error: 'Cấu hình VNPay không hợp lệ' });
//       }
  
//       // Khởi tạo VNPay
//       const vnpay = new VNPay({
//         tmnCode: tmnCode,
//         secureSecret: secureSecret,
//         vnpayHost: 'https://sandbox.vnpayment.vn',
//         testMode: true,
//         loggerFn: ignoreLogger,
//       });
  
//       // Lấy amount từ body hoặc mặc định
//       const amount = req.body.amount ? Number(req.body.amount) * 100 : 50000 * 100; // Sửa lỗi đơn vị
//       const txnRef = Date.now().toString(); // Mã giao dịch duy nhất
//       const now = new Date();
  
//       // Xây dựng URL thanh toán
//       let vnpayResponse = await vnpay.buildPaymentUrl({
//         vnp_Amount: amount,
//         vnp_IpAddr: req.ip || '127.0.0.1',
//         vnp_TxnRef: txnRef,
//         vnp_OrderInfo: `Thanh toán đơn hàng ${txnRef}`,
//         vnp_ExpireDate: dateFormat(new Date(now.getTime() + 15 * 60 * 1000)),
//         vnp_OrderType: ProductCode.Other,
//         vnp_ReturnUrl: 'http://localhost:3000/api/vnpay_return', // Sửa cổng, 
//         vnp_Locale: VnpLocale.VN,
//         vnp_CreateDate: dateFormat(now),
//       });
      
//       const finalUrl = vnpayResponse ;
  
//       // Trả về JSON chứa URL thanh toán
//       return res.status(200).json({ paymentUrl: vnpayResponse  });
//     } catch (error) {
//       console.error('Lỗi tạo URL thanh toán:', error);
//       return res.status(500).json({ error: 'Không thể tạo URL thanh toán' });
//     }
//   });

// app.get('/api/vnpay_ipn', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//     // try {
//     //   const vnp_Params = { ...req.query } as Record<string, string>;
//     //   const secureHash = vnp_Params['vnp_SecureHash'];
  
//     //   // Bỏ các trường không cần thiết để verify
//     //   delete vnp_Params['vnp_SecureHash'];
//     //   delete vnp_Params['vnp_SecureHashType'];
  
//     //   const sortedParams = sortObject(vnp_Params);
//     //   const signData = qs.stringify(sortedParams, { encode: false });
  
//     //   const signed = crypto
//     //     .createHmac('sha512', process.env.VNP_HASHSECRET!)
//     //     .update(Buffer.from(signData, 'utf-8'))
//     //     .digest('hex');
  
//     //   // So sánh chữ ký
//     //   if (secureHash !== signed) {
//     //     return res.status(400).json({ RspCode: '97', Message: 'Checksum sai' });
//     //   }
  
//     //   // Kiểm tra mã phản hồi từ VNPay
//     //   const success = vnp_Params['vnp_ResponseCode'] === '00';
  
//     //   const dataToSave = {
//     //     userId: "",
//     //     orderId: vnp_Params['vnp_TxnRef'],
//     //     amount: parseFloat(vnp_Params['vnp_Amount']) / 100,
//     //     orderInfo: vnp_Params['vnp_OrderInfo'],
//     //     bankCode: vnp_Params['vnp_BankCode'],
//     //     payDate: vnp_Params['vnp_PayDate'],
//     //     transactionNo: vnp_Params['vnp_TransactionNo'],
//     //     cardType: vnp_Params['vnp_CardType'],
//     //     status: success ? 'SUCCESS' : 'FAILED',
//     //   };
  
//     //   // Kiểm tra đã tồn tại chưa để tránh trùng
//     //   const existing = await prisma.payment.findUnique({
//     //     where: { transactionNo: dataToSave.transactionNo },
//     //   });
  
//     //   if (!existing) {
//     //     await prisma.payment.create({ data: dataToSave });
//     //   }
  
//     //   //  res.status(200).json({ RspCode: '00', Message: 'Success' });
      
//     // } catch (error) {
//     //   console.error('VNPay IPN error:', error);
//     //    res.status(500).json({ RspCode: '99', Message: 'Lỗi hệ thống' });
//     // }
//     console.log("okelllllllllllllllllll")
//   });




app.use("/api/auth",setupAuthModule())

app.use("/api/user",setupUserModule())

app.use("/api/listing",setupListingModule())

app.use("/api/reservation", setupReservationModule())

app.use(errorHandler)

const PORT = 8080

app.listen(PORT, () =>{
    console.log("oke")
})









