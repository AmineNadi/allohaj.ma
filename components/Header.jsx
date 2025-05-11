

import logoAN from '../public/logo.svg'
import Image from "next/image"
import IconsSocial from './IconsSocial'



const Header = () => {
  return (
    <header className="md:px-9 lg:px-20 mx-auto w-full h-[80px] z-20 px-4">
        <div className="flex justify-between items-center py-4">
        

            <Image
                  src={logoAN}
                  width={100}
                  height={60}
                  alt="logo"
                  className='object-cover'
                />
            
            
            <IconsSocial/>
        </div>
        
    </header>
  )
}

export default Header