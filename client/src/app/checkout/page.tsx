'use client'

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft, Star, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCheckoutStore } from "@/hooks/useCheckout"
import { format } from 'date-fns'
import axios from "axios"


const page = () => {
  const [paymentMethod, setPaymentMethod] = useState("full")
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1])
  const { data, clear } = useCheckoutStore()

  const payment = async() => {
    try {
      const result =await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-qr`,{
        // const { userId, listingId, startDate, endDate, totalPrice } = req.body
        listingId: data?.listingId,
        startDate: data?.dateRange.startDate,
        endDate: data?.dateRange.endDate,
        totalPrice: data?.totalPrice
      },{
        withCredentials: true
      })

      // console.log(result)
      window.location.href = result.data.paymentUrl
    } catch (error) {
      
    }
  }

  return (
    <div className="min-h-screen bg-white">
      
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center">
          <ArrowLeft className="mr-4 h-5 w-5"/>
          <h1 className="text-xl font-semibold">Payment Confirmation</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 ">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">1. Select Payment Time</h2>
                  {
                    completedSteps.includes(1) && (
                      <Button size={"sm"} variant={"outline"} onClick={() => setCurrentStep(1)}>Change</Button>
                    )
                  }
                </div> 
                {
                  currentStep === 1 || !completedSteps.includes(1) ? (
                    <>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="full" id="full"></RadioGroupItem>
                              <Label htmlFor="full" className="font-medium">Pay now $
                                {data?.totalPrice}
                              </Label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border p-4 ">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="partial" id="partial" />
                            <div>
                              <Label htmlFor="partial" className="font-medium">Pay a portion now, the rest later.</Label>
                              { data?.totalPrice && (
                                <p className="text-sm text-gray-600">
                                  Pay ₫{data.totalPrice*2/10} now and the remaining ₫{data.totalPrice*8/10}. No additional fees.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                      <Button className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                        onClick={() => {
                          setCompletedSteps([...completedSteps, 1])
                          setCurrentStep(2)
                        }}
                      >
                        Continue
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm font-semibold text-gray-600">
                      {paymentMethod === "full" ? "Pay now" : "Pay a portion now, the rest later" }
                    </div>
                  )
                }
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold"> 
                    2.Review your booking
                  </h2>
                </div>
                
                {currentStep === 2 || completedSteps.includes(2) ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium md-2">
                        Booking Information
                      </h4>
                      <p className="text-gray-600 text-sm">{data?.listing.title}</p>
                      <p className="text-sm text-gray-600">{format(data?.dateRange.startDate!, 'dd/MM/yyyy')} - {format(data?.dateRange.endDate!, 'dd/MM/yyyy')}</p>
                    </div>
                    {currentStep === 2 && (
                      <Button className="w-full bg-black text-white hover:bg-gray-800"
                      onClick={() => {
                        setCurrentStep(3)
                        setCompletedSteps([...completedSteps, 2])
                      }}
                      >
                        Continue
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-gray-600">
                    Complete step 1 to continue
                  </div>
                )}

              </CardContent>
            </Card>

            <div className="mt-2"  onClick={() => payment()}>
              <Button className="w-full bg-rose-500 text-white hover:bg-rose-600">
                Confirm and Pay
              </Button>
            </div>

          </div>

          <div className="lg:sticky lg:top-8">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex space-x-4">
                  <Image
                    src={data?.listing.imageSrc?.[0] || "/Airbnb_Logo_PNG_(10).png"}
                    alt="Listing image"
                    width={80}
                    height={80}
                    className="round-lg object-cover"
                  ></Image>
                  <div>
                    <h3 className="font-semibold">
                      {data?.listing.title}
                    </h3>
                    <div className="font-serif">
                      {data?.listing.locationValue}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current"></Star>
                      <span className="text-sm font-semibold">5.0</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6 space-y-2">
                  <h4 className="font-semibold">
                    Cancellable for free
                  </h4>
                </div>

                <div className="mb-6 space-y-2">
                  <h4 className="font-semibold">Thông tin chuyến đi</h4>
                  <p className="font-medium">{format(data?.dateRange.startDate!, 'dd/MM/yyyy')} - {format(data?.dateRange.endDate!, 'dd/MM/yyyy')}</p>
                  <p className="font-medium">{data?.listing.guestCount} people</p>
                  <p className="font-medium">{data?.listing.bathroomCount} bathroom</p>
                  <p className="font-medium">{data?.listing.roomCount} room</p>
                </div>

                <div className="flex justify-between border-t pt-4 space-y-3">
                  <span>Total Price</span>
                  <span>₫{data?.totalPrice}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  )
}

export default page