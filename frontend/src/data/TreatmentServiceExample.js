import React from "react";
import TreatmentService from "../components/servicios/treatmentServiceSingle";

const TreatmentServiceExample = () => {
    // Datos de ejemplo para diferentes servicios
    const servicesData = [
        {
            id: 1,
            image: "/servicios/Tratamiento_Facial/hydrafacial.jpg",
            title: "Hydrafacial",
            description: "Tratamiento facial revolucionario que combina limpieza profunda, exfoliación, extracción, hidratación y protección antioxidante en una sola sesión.",
            price: "$15.000",
            link: "tratamientos-faciales",
            imagePosition: "left",
            showLine: true,
            promoLink: "https://wa.me/1234567890"
        },
        {
            id: 2,
            image: "/servicios/Masajes/MasajeComun.jpg",
            title: "Masaje Relajante",
            description: "Masaje terapéutico diseñado para aliviar el estrés, reducir la tensión muscular y promover la relajación profunda del cuerpo y la mente.",
            price: "$12.000",
            link: "masajes",
            imagePosition: "right",
            showLine: false
        },
        {
            id: 3,
            image: "/servicios/Depilacion_laser/Depilacion_Laser_Piernas.jpg",
            title: "Depilación Láser",
            description: "Tratamiento definitivo para eliminar el vello no deseado utilizando tecnología láser de última generación, seguro y efectivo.",
            price: "$25.000",
            link: "depilacion-laser",
            imagePosition: "left",
            showPrice: true,
            showPromo: false
        },
        {
            id: 4,
            image: "/servicios/Tratamientos_Corporales/Mesoterapia.jpg",
            title: "Mesoterapia Corporal",
            description: "Tratamiento no quirúrgico que combina microinyecciones de vitaminas, minerales y aminoácidos para mejorar la textura y firmeza de la piel.",
            price: "$18.000",
            link: "tratamientos-corporales",
            imagePosition: "right",
            customButtonText: "RESERVÁ TU TURNO",
            customButtonLink: "https://wa.me/1234567890"
        }
    ];

    return (
        <div>
            <h1 style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--terciary-color)' }}>
                Ejemplos de Uso del Componente TreatmentService
            </h1>
            
            {servicesData.map((service, index) => (
                <TreatmentService
                    key={service.id}
                    image={service.image}
                    title={service.title}
                    description={service.description}
                    price={service.price}
                    link={service.link}
                    imagePosition={service.imagePosition}
                    showLine={service.showLine}
                    showPrice={service.showPrice}
                    showPromo={service.showPromo}
                    promoLink={service.promoLink}
                    customButtonText={service.customButtonText}
                    customButtonLink={service.customButtonLink}
                />
            ))}
        </div>
    );
};

export default TreatmentServiceExample; 