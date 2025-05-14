import { FaInstagram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";


const IconsSocial = () => {
    const IconsData = [
        {
            name:"Instagram",
            icon: <FaInstagram size={20}/>,
            link: "https://www.instagram.com/allohaj.ma/"
        },
        {
            name:"Whatsapp",
            icon: <FaWhatsapp size={20} color='green'/>,
            link: "https://wa.me/+212691572526"
        },
        {
            name:"Tiktok",
            icon: <FaTiktok size={20} color='#ff0050'/>,
            link: "https://www.tiktok.com/@allohaj33"
        },
        
    ]
  return (
    <div className="flex gap-3 items-center justify-center">
        {
            IconsData.map((icon,key) => {
                return <a key={key} aria-label={icon.name} href={icon.link} target="_blank" rel="noopener noreferrer">{icon.icon}</a>
            })
        }
        
    </div>
  )
}

export default IconsSocial