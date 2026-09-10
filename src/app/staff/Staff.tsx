"use client";
import MembersGrid from "@/components/MembersGrid";
import "@/styles/bureau.css";

const staffData = [
    { name: "Matéo", role: "Coach Flag", image: "/assets/images/staff&bureau/mateo.png" },
    { name: "Pepito", role: "Coach Flag", image: "/assets/images/staff&bureau/pepito.png" },
    { name: "Benjamin", role: "Coach Foot", image: "/assets/images/staff&bureau/benjamin.png" },
    { name: "Remis", role: "Coach Juniors", image: "/assets/images/staff&bureau/remis.png" },
    { name: "Margaux", role: "Coach cheer", image: "/assets/images/staff&bureau/margaux.png" },
    { name: "Carla", role: "Coach cheer", image: "/assets/images/staff&bureau/carla.png" },
    { name: "Mag", role: "Arbitre", image: "/assets/images/staff&bureau/mag.png" },
    { name: "Thomas", role: "Arbitre", image: "/assets/images/staff&bureau/thomas.png" },
    { name: "Edouard", role: "Arbitre", image: "/assets/images/staff&bureau/edouard.png" },
];

export default function StaffPage() {
    return (
        <MembersGrid title="Membres du Staff" data={staffData} />
    );
}
