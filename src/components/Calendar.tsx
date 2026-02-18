"use client";
import "@/styles/calendar.css";
import { useState } from "react";
import Image from "next/image";
import { ArrowBallLeft, ArrowBallRight } from "@/components/svg/arrowBall.svg";

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date();
    const todayString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const changeMonth = (direction: number) => {
        setCurrentDate(new Date(year, month + direction, 1));
    };

    const generateCalendar = () => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDay = (firstDay.getDay() + 6) % 7;
        const totalDays = lastDay.getDate();

        const days = [];

        const prevLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const dayNumber = prevLastDay - i;
            const date = new Date(year, month - 1, dayNumber);
            const fullDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");

            days.push({
                dayNumber,
                fullDate,
                currentMonth: false,
                isToday: fullDate === todayString
            });
        }

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(year, month, i);
            const fullDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");

            days.push({
                dayNumber: i,
                fullDate,
                currentMonth: true,
                isToday: fullDate === todayString
            });
        }

        while (days.length < 42) {
            const nextDay: number = days.length - (startDay + totalDays) + 1;
            const date = new Date(year, month + 1, nextDay);
            const fullDate = date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");

            days.push({
                dayNumber: nextDay,
                fullDate,
                currentMonth: false,
                isToday: fullDate === todayString
            });
        }

        return days;
    };

    const calendarDays = generateCalendar();

    // ÉVÉNEMENTS
    const events: Record<string, any> = {
        "2026-02-01": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/SPHINX.png",
                "/assets/images/teams/FLAGMINGOS.png",
                "/assets/images/teams/BLUERAVENS.png",
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
        "2026-02-08": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/LIONS.png",
                "/assets/images/teams/SANGLIERS.png",
                "/assets/images/teams/PHENIX.png"
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
        "2026-02-22": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/LIONS.png",
                "/assets/images/teams/SANGLIERS.png",
                "/assets/images/teams/PHENIX.png"
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
        "2026-02-28": {
            type: "vs",
            images: ["/assets/images/teams/ANGES.png", "/assets/images/teams/HORNETS.png"],
            icon: "/assets/images/ball.svg"
        },
        "2026-03-08": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/LIONS.png",
                "/assets/images/teams/SANGLIERS.png",
                "/assets/images/teams/PHENIX.png"
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
        "2026-03-15": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/SPHINX.png",
                "/assets/images/teams/FLAGMINGOS.png",
                "/assets/images/teams/BLUERAVENS.png",
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
        "2026-03-21": {
            type: "vs",
            images: ["/assets/images/teams/ANGES.png", "/assets/images/teams/BLUERAVENS.png"],
            icon: "/assets/images/ball.svg"
        },
        "2026-03-29": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/LIONS.png",
                "/assets/images/teams/SANGLIERS.png",
                "/assets/images/teams/PHENIX.png"
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
        "2026-04-05": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/SPHINX.png",
                "/assets/images/teams/FLAGMINGOS.png",
                "/assets/images/teams/BLUERAVENS.png",
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
        "2026-04-11": {
            type: "vs",
            images: ["/assets/images/teams/ANGES.png", "/assets/images/teams/HORNETS.png"],
            icon: "/assets/images/ball.svg"
        },
        "2026-04-19": {
            type: "multiple",
            images: [
                "/assets/images/teams/ANGES.png",
                "/assets/images/teams/SPHINX.png",
                "/assets/images/teams/FLAGMINGOS.png",
                "/assets/images/teams/BLUERAVENS.png",
            ],
            icon: "/assets/images/flag-calendar2.svg"
        },
    };

    return (
        <>
            <h2 className="section-title" style={{ textAlign: "center", marginTop: "6rem" }}>Calendrier</h2>

            <section className="calendar-container">

                <div className="calendar-header">
                    <div className="calendar-arrow" onClick={() => changeMonth(-1)}>
                        <ArrowBallLeft width={50} height={50} className="slider-arrow-svg arrow-left" />
                    </div>

                    <h3 className="calendar-title">
                        {currentDate.toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h3>

                    <div className="calendar-arrow" onClick={() => changeMonth(1)}>
                        <ArrowBallRight width={50} height={50} className="slider-arrow-svg arrow-right" />
                    </div>
                </div>

                <div className="calendar-weekdays">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                        <div key={d} className="calendar-weekday">{d}</div>
                    ))}
                </div>

                <div className="calendar-grid">
                    {calendarDays.map((day, index) => {
                        const event = events[day.fullDate];

                        return (
                            <div key={index} className={`calendar-cell ${!day.currentMonth ? "other-month" : ""}${day.isToday ? "today" : ""}`}>
                                <div className="calendar-date">{day.dayNumber}</div>

                                {event?.icon && (
                                    <Image src={event.icon} alt="" width={22} height={event.type == "vs" ? 35 : 30} className="calendar-icon" />
                                )}

                                {event && (
                                    <div className="calendar-content">

                                        {event.type === "vs" && (
                                            <div className="calendar-vs">
                                                <Image src={event.images[0]} alt="" width={28} height={28} />
                                                <span className="vs-text">VS</span>
                                                <Image src={event.images[1]} alt="" width={28} height={28} />
                                            </div>
                                        )}

                                        {event.type === "multiple" && (
                                            <div className="calendar-multiple">
                                                {event.images.map((img: string, idx: number) => (
                                                    <Image key={idx} src={img} alt="" width={24} height={24} />
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
