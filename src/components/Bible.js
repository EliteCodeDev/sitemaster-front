import React, { useEffect, useState } from "react";

const bibleVerses = [
  { verse: "Porque tanto amó Dios al mundo, que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.", reference: "Juan 3:16" },
  { verse: "El Señor es mi pastor, nada me faltará.", reference: "Salmos 23:1" }, 
  { verse: "Todo lo puedo en Cristo que me fortalece.", reference: "Filipenses 4:13" },
  { verse: "Sé fuerte y valiente. No temas ni te acobardes, porque el Señor tu Dios estará contigo dondequiera que vayas.", reference: "Josué 1:9" },
  { verse: "El amor es paciente, es bondadoso. El amor no es envidioso ni jactancioso ni orgulloso.", reference: "1 Corintios 13:4" },
  { verse: "Confía en el Señor de todo corazón, y no en tu propia inteligencia.", reference: "Proverbios 3:5" },
  { verse: "Clama a mí, y yo te responderé, y te daré a conocer cosas grandes y ocultas que tú no sabes.", reference: "Jeremías 33:3" },
  { verse: "A cualquiera, pues, que me confiese delante de los hombres, yo también le confesaré delante de mi Padre que está en los cielos.", reference: "Mateos 10:32" },
];

const RandomBibleText = () => {
  const [randomVerse, setRandomVerse] = useState(bibleVerses[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    setRandomVerse(bibleVerses[randomIndex]);
  }, []);

  return (
    <div className="text-left font-sans text-gray-600">
      <p className="text-xs italic">
        "{randomVerse.verse}" - <span className="font-bold">{randomVerse.reference}</span>
      </p>
    </div>
  );
};

export default RandomBibleText;
