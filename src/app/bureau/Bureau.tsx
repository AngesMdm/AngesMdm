"use client";
import MembersGrid from "@/components/MembersGrid";
import "@/styles/bureau.css";

const bureauData = [
    { name: "Tony", role: "Trésorier", image: "/assets/images/staff&bureau/tony2.png", fixTop: false },
    { name: "Pepito", role: "Trésorier", image: "/assets/images/staff&bureau/pepito.png", fixTop: false },
    { name: "Mag", role: "Secrétaire", image: "/assets/images/staff&bureau/mag2.png", fixTop: false }
];

export default function BureauPage() {
    return (
        <MembersGrid title="Membres du Bureau" data={bureauData} />
    );
}
