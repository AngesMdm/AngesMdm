"use client";
import RevealCascade from "@/components/RevealOnSCroll";
import "@/styles/bureau.css";

export default function MembersGrid({ title, data }: { title: string; data: Array<{ image: string; name: string; role: string }> }) {
  return (
    <div style={{ marginTop: "9rem" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>{title}</h1>

      <div className="bureau-wrapper">
        <div className="bureau-grid">
          {data.map((member: { image: string; name: string; role: string }, index: number) => (
            <RevealCascade key={index} index={index}>
              <div className="bureau-card">
                <div className="bureau-image">
                  <img src={member.image} alt={member.name} />
                </div>

                <div className="bureau-role">{member.role}</div>
                <div className="bureau-name">{member.name}</div>
              </div>
            </RevealCascade>
          ))}
        </div>
      </div>
    </div>
  );
}
