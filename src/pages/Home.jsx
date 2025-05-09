import { motion } from "framer-motion";

export const Home = () => {(
    <div className="home">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="home-title">
        Peter Shin
      </motion.h1>
      <p className="home-subtitle">Cinematographer / DP</p>
    </div>
  )};
