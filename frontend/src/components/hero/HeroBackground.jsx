import { motion } from "framer-motion";

export default function HeroBackground() {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-[#020817]">

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Blue Blob */}
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[120px]"
        />

        {/* Purple Blob */}
        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-40 h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-[120px]"
        />

        {/* Cyan Blob */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 80, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-[120px]"
        />

        {/* Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,.12),transparent_65%)]" />

      </div>
    </>
  );
}