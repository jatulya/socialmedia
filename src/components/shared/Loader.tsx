import { hourglass } from "ldrs"

const Loader = () => {
    hourglass.register()
  return (
    <div className="flex-center w-full">
        <l-hourglass
            size="25"
            bg-opacity="0.1"
            speed="1.75" 
            color="white" 
        />
    </div>
  )
}

export default Loader
