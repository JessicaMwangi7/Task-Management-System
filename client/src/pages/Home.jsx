import Navbar from "../components/NavBar"; // ✅ Ensure correct file casing (NavBar.jsx)
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "./Features";
import Newsletter from "../components/Newsletter";

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;
