import InstallButton from "./InstallButton"

const Hero = () => {
  return (
    <section>
            <h1 className="text-3xl lg:text-4xl font-bold mb-16 text-center">! ألو الحاج… يوصلها ليك سخونة و بلا نقاش </h1>
            <InstallButton />
            <p className="text-xl lg:text-2xl font-bold mb-6 text-center">اختر طلبيتك الآن</p>
            <div className="scroll-demo">
                <span></span>
            </div>
    </section>
    
  )
}

export default Hero