import { useRef } from "react"
import { Link } from 'react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { LuArrowDown as ArrowDown } from "react-icons/lu"
import featureTemplates from '../assets/feature-templates.png'
import featureTailor from '../assets/feature-tailor.png'
import featureExport from '../assets/feature-export.png'

const sections = [
    {
        id: 1,
        title: "Pick a Template That Fits.",
        description: "Choose from a curated collection of professionally designed resume templates — crafted to look sharp in the eyes of hiring managers and pass ATS filters without compromise.",
        imageUrl: featureTemplates,
        reverse: false
    },
    {
        id: 2,
        title: "Built for Every Career Path.",
        description: "Whether you're an engineer, designer, product manager, or recent graduate — CraftCV gives you layouts and sections tailored to your field. No generic, one-size-fits-all approach.",
        imageUrl: featureTailor,
        reverse: true
    },
    {
        id: 3,
        title: "Export and Apply, Instantly.",
        description: "When you're ready, download your resume as a clean, print-ready PDF. Share it directly with recruiters or attach it to any job application — formatted perfectly every time.",
        imageUrl: featureExport,
        reverse: false
    }
]

const ParallaxSectionItem = ({ section }) => {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center start"]
    })

    const opacityContent = useTransform(scrollYProgress, [0, 0.7], [0, 1])
    // scaleX is GPU-composited (no repaint), used instead of clipPath
    const scaleXContent = useTransform(scrollYProgress, [0, 0.7], [0, 1])
    const translateContent = useTransform(scrollYProgress, [0, 1], [-50, 0])

    return (
        <div
            ref={ref}
            className={`h-screen flex items-center justify-center md:gap-40 gap-20 ${section.reverse ? 'flex-row-reverse' : ''}`}
        >
            {/* single y translation — don't double-apply on child */}
            <motion.div style={{ y: translateContent }}>
                <div className="text-6xl max-w-sm elsie-black text-white">{section.title}</div>
                <p className="text-white/70 max-w-sm mt-10">
                    {section.description}
                </p>
            </motion.div>
            <motion.div
                style={{
                    opacity: opacityContent,
                    scaleX: scaleXContent,
                    transformOrigin: 'left center',
                    willChange: 'transform, opacity',
                }}
                className="relative"
            >
                <img
                    src={section.imageUrl}
                    className="w-[340px] md:w-[460px] max-h-[360px] object-cover rounded-2xl border border-white/15 shadow-2xl bg-[#0a0a0a]"
                    alt={`Section ${section.id}`}
                />
            </motion.div>
        </div>
    )
}

export const Component = () => {
    return (
        <div className="bg-black">
            <div className='min-h-screen text-white w-full bg-black flex flex-col items-center justify-center'>
                <h1 className='text-8xl max-w-4xl text-center elsie-black'>Everything You Need to Land the Job.</h1>
                <p className='mt-6 flex items-center gap-1.5 text-sm text-white/50'>Scroll to explore &nbsp;<ArrowDown size={14} /></p>
            </div>

            <div className="flex flex-col md:px-0 px-10">
                {sections.map((section) => (
                    <ParallaxSectionItem key={section.id} section={section} />
                ))}
            </div>

            <div className='min-h-screen w-full bg-black flex flex-col items-center justify-center gap-6 text-white'>
                <h1 className='text-8xl elsie-black text-center max-w-3xl'>Start with the example resume.</h1>
                <p className='text-white/50 text-lg max-w-xl text-center'>The builder opens on a worked example. Replace it section by section, and watch the ATS score update as you go.</p>
                <Link to='/builder' className='mt-4 border border-white/30 text-white px-8 py-4 rounded-2xl hover:bg-white hover:text-black transition-all duration-300'>Open the builder</Link>
            </div>
        </div>
    )
}
