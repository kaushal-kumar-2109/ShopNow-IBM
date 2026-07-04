import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        width: "100%",
        backgroundColor: "transparent"
      }}
    >
      <motion.div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "4px solid #e1e1e1",
          borderTopColor: "#e53637",
          borderBottomColor: "#111111"
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear"
        }}
      />
    </div>
  );
}
