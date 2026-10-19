import LogoLoop from './LogoLoop';
import {   FaUserDoctor,
  FaUserTie,
  FaUserGraduate,
  FaCode,
  FaFlask,
  FaChalkboardUser,
  FaPalette,
  FaGavel,
  FaBriefcase,
  FaChartLine,
  FaCamera,
  FaPenNib,
  FaLaptopCode } from 'react-icons/fa6';
  import BlurText from './BlurText';

const careerFields = [
  { node: <FaUserDoctor />, title: "Healthcare" },
  { node: <FaUserTie />, title: "Business" },
  { node: <FaCode />, title: "Software" },
  { node: <FaFlask />, title: "Research" },
  { node: <FaBriefcase />, title: "Consulting" },
  { node: <FaUserGraduate />, title: "Graduates" },
  { node: <FaChalkboardUser />, title: "Teaching" },
  { node: <FaPalette />, title: "Design" },
  { node: <FaGavel />, title: "Law" },
  { node: <FaChartLine />, title: "Finance" },
  { node: <FaCamera />, title: "Photography" },
  { node: <FaPenNib />, title: "Writing" },
  { node: <FaLaptopCode />, title: "Engineering" },
];



function AfterHero() {
  return (
    <>
    <div className='text-white bg-black pt-15 min-h-screen'>
    <div className='flex flex-col justify-center items-center elsie-black mb-20 gap-4 '>
      {/* <p className='text-6xl'>Create a Resume For Any Career </p> */}
       <BlurText
         text="Create a Resume For Any Career"
        delay={200}
        animateBy="words"
       direction="top"
       className="text-6xl elsie-black text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.3)]"
   />
       <BlurText
         text="Professional templates designed to fit your skills, experience, and ambitions."
        delay={200}
        animateBy="words"
       direction="top"
       className="text-lg elsie-black text-white"
   />
      {/* <p className='text-lg'>Professional templates designed to fit your skills, experience, and ambitions. </p> */}
    </div>
    <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}} className='mt-40'>
      {/* Basic horizontal loop */}
      <LogoLoop
        logos={careerFields}
        speed={100}
        direction="left"
        logoHeight={110}
        gap={60}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#000000"
        ariaLabel="Career fields CraftCV has templates for"
      />

    </div>

    </div>
    </>
  );
}

export default AfterHero