import React from 'react';

const Footer = () => {
  return (
    <div className='bg-neutral-100 flex-col px-8 py-5'>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <div className='font-semibold pb-3 text-lg'>Support</div>
          <div className='leading-8 text-sm font-sans'>
            Help Center<br />
            Safety information<br />
            AirCover<br />
            Anti-discrimination<br />
            Accessibility support<br />
            Cancellation options<br />
            Neighborhood concerns<br />
          </div>
        </div>
        <div className='flex-1'>
          <div className='font-semibold pb-3 text-lg'>Hosting</div>
          <div className='leading-8 text-sm font-sans'>
            Try hosting<br />
            Rent out your home on Airbnb<br />
            AirCover for Hosts<br />
            Hosting resources<br />
            Community forum<br />
            Responsible hosting<br />
            Free hosting course<br />
            Find a hosting mentor
          </div>
        </div>
        <div className='flex-1'>
          <div className='font-semibold pb-3 text-lg'>Airbnb</div>
          <div className='leading-8 text-sm font-sans'>
            About Airbnb<br />
            Summer 2025 Release<br />
            Newsroom<br />
            New features<br />
            Careers<br />
            Investors<br />
            Airbnb.org emergency stays
          </div>
        </div>
      </div>

      <hr className="h-1 my-4 bg-neutral-50" />

      <div className='flex justify-between items-center'>
        <div>© 2025 Airbnb</div>
        <div>English</div>
      </div>
    </div>
  );
};

export default Footer;
