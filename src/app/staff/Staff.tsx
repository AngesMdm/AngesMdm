"use client";
import MembersGrid from "@/components/MembersGrid";
import "@/styles/bureau.css";

const staffData = [
    { name: "Tony", role: "Coach Flag", image: "/assets/images/staff&bureau/tony2.png" },
    { name: "Pepito", role: "Coach Flag", image: "/assets/images/staff&bureau/pepito.png" },
    { name: "Remis", role: "Coach Foot", image: "/assets/images/staff&bureau/remis.png" },
    { name: "Nico", role: "Coach Foot", image: "/assets/images/staff&bureau/nico.png" },
    { name: "Thibaut", role: "Coach Juniors", image: "/assets/images/staff&bureau/thibaut.png" },
    { name: "Margaux", role: "Coach cheer", image: "/assets/images/staff&bureau/margaux.png" },
    { name: "Carla", role: "Coach cheer", image: "/assets/images/staff&bureau/carla.png" },
    { name: "Mag", role: "Arbitre", image: "/assets/images/staff&bureau/mag2.png" },
    { name: "Mams", role: "Arbitre", image: "/assets/images/staff&bureau/mams.png" },
    { name: "Thomas", role: "Arbitre", image: "/assets/images/staff&bureau/thomas.png" },
    { name: "Edouard", role: "Arbitre", image: "/assets/images/staff&bureau/edouard.png" },
];

export default function StaffPage() {
    return (
        <MembersGrid title="Membres du Staff" data={staffData} />
    );
}
