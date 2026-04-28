import HeroBanner from "@/components/HeroBanner";
import Available from "@/components/service-area/Available";
import Coverage from "@/components/service-area/Coverage";
import Foundation from "@/components/service-area/Foundation";
export const metadata = {
  title: "Locations - New York Commercial Clean Team INC",
  description: "professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference",
};
export default function ServieArea() {
  return (
    <main>
       <HeroBanner title="Commercial Cleaning Across New York City" pageName="Locations" desc="Manhattan, Brooklyn, Queens, the Bronx, Staten Island, and Long Island — local teams, consistent standards."/>
        <Foundation/>
        <Coverage/>
        <Available/>
    </main>
  )
}
