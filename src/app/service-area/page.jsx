import Available from "@/components/service-area/Available";
import Coverage from "@/components/service-area/Coverage";
import Foundation from "@/components/service-area/Foundation";
import HeroSection from "@/components/service-area/HeroSection";

export default function ServieArea() {
  return (
    <main>
        <HeroSection/>
        <Foundation/>
        <Coverage/>
        <Available/>
    </main>
  )
}
