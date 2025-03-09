import React, { useEffect } from 'react'
import { useStrapiData } from '@/services/strapiServiceJWT'
import { useStrapiData as hola } from '@/services/strapiService'

import { useSession } from 'next-auth/react';

export default function Index() {
  // Se obtiene la sesión usando el hook useSession
  const { data: session } = useSession();

  // Se llama al hook useStrapiData utilizando el JWT de la sesión (si existe)
  const { data, error, isLoading } = useStrapiData(
    'users/me',
    session?.jwt  // Se usa el operador ? para evitar errores si session es null
  );
  const { data: subs, error: errorId, isLoading: isLoadingId } = useStrapiData(
    'users/me?populate=subscriptions',
    session?.jwt  // Se usa el operador ? para evitar errores si session es null
  );
  // Se utiliza useEffect para hacer algo cuando se tenga la data
  useEffect(() => {
    if (data) {
      console.log(data.id)
    }
    if (subs) {
      console.log(subs)
    }
  }, [data]);

  return (
    <div className='grid place-items-center'>ssfsdfsdf
      {/* <div className='card-border'>
        Ratione amet, minima architecto beatae commodi eos repellat cumque quae ab? Quia amet temporibus doloremque cumque autem laboriosam velit, similique possimus neque beatae unde explicabo nisi minima eum inventore ad.
        Corporis perspiciatis et aspernatur praesentium ratione eaque beatae atque quas nobis libero. Eius aliquam ducimus incidunt eum quae sunt doloremque officiis nisi iste, deserunt voluptatem ipsa, itaque, sequi suscipit culpa!
        Magnam obcaecati illo inventore neque consequatur. Culpa, blanditiis? Labore ducimus, amet ipsam beatae rerum facilis quasi. Excepturi labore reprehenderit saepe nihil eveniet temporibus sunt iusto nisi veniam, earum aliquid accusantium.
        Rerum, eveniet incidunt? Quia eius consequuntur cum veritatis quas magnam, laborum tenetur fugiat, rem placeat nemo, aliquam facilis molestias cupiditate vel! Doloremque fuga repudiandae ipsam iste illum debitis obcaecati sunt.
        Et nihil magnam explicabo, accusamus quo minus. Sit officia voluptatibus totam error provident rerum labore velit eum cumque ut placeat, voluptate fugiat dignissimos quo nihil facilis? Nemo officia dolores aspernatur!
        Et, dignissimos? Aliquid dolorem corrupti voluptatum autem accusantium ipsa fuga ea dolorum quidem exercitationem vero dicta ipsam debitis voluptas neque tenetur magni itaque, eligendi deleniti eum quo excepturi accusamus porro?
        Ab nostrum, et nemo ut molestiae consequatur minima vitae! Ipsum earum, recusandae reiciendis aliquid in magni necessitatibus sequi laborum harum fuga officia cum rem accusamus aut, perspiciatis atque unde porro.
        Provident tenetur voluptatem impedit accusantium commodi pariatur placeat maxime quod esse facilis repudiandae dolore, reprehenderit fugiat itaque, debitis et consectetur natus. Ducimus quibusdam sint soluta distinctio nam unde omnis nihil!
        Ad vel reprehenderit nam ducimus, aliquam unde esse quae explicabo blanditiis iure delectus libero culpa aliquid maiores odio tempora, excepturi odit minima minus dolore eveniet modi corporis dolor voluptas. Aspernatur?
        Iste dolore culpa veniam laborum natus voluptatum, neque dolores, commodi laudantium esse excepturi. Iusto magnam aperiam nobis, dignissimos fugiat unde impedit ut vitae possimus explicabo error mollitia esse odit illo?
        Eius placeat quos, tempora incidunt dolorum molestias repudiandae recusandae consequuntur sint dolor perferendis amet aspernatur quod qui adipisci? Dicta perferendis iusto officiis nam! Officia, maxime quidem sunt eius dolores deleniti?
        Voluptatum libero quia numquam architecto reiciendis ipsam laudantium molestias magnam. Accusantium, quasi! Molestias iure ab exercitationem, porro reprehenderit dignissimos quisquam ullam architecto! Distinctio ad nesciunt ex ab itaque aspernatur asperiores?
        Ipsam deleniti dolorum aliquam. Vitae odio quis quasi eius repudiandae voluptas quam esse facilis! Voluptate atque odio expedita alias nesciunt voluptas hic quisquam veniam numquam, qui, beatae distinctio ex cupiditate?
        Vitae dolore nobis molestias obcaecati fugit ipsum incidunt beatae sequi optio expedita facere veritatis autem, temporibus at minima, dolorum, explicabo officiis maxime. Debitis omnis sed quo sit! Exercitationem, alias praesentium.
        Quaerat, debitis architecto! Corrupti sit ipsa eveniet culpa ab quia aut temporibus non necessitatibus numquam ad debitis vel mollitia officiis dignissimos minus tempore soluta, facilis laborum, possimus quisquam consequuntur deserunt?
        Excepturi corrupti accusantium alias voluptas ducimus saepe fuga. Excepturi optio vitae debitis accusamus architecto voluptatibus dolorem numquam harum sapiente asperiores animi obcaecati quos esse cum sequi provident, commodi consequatur voluptate.
        Facilis repudiandae atque nesciunt, praesentium reprehenderit sequi explicabo iure ut illum quibusdam quidem placeat! Doloremque nobis quod iste temporibus, ratione, atque dolore sint veniam delectus sit iusto ea ipsa recusandae?
        Perspiciatis asperiores earum quia reiciendis deleniti culpa sapiente molestiae commodi possimus autem dignissimos nemo, incidunt rem temporibus modi atque qui pariatur beatae, laudantium voluptate amet quibusdam itaque! Ex, qui inventore.
        Possimus facere magnam sapiente, necessitatibus at velit corporis aliquid enim, ab sint sequi laudantium consectetur cupiditate, a placeat dolore delectus rem suscipit deleniti tenetur! Neque fuga tempore voluptatum libero. Amet?
      </div> */}
      <div className='card-border'>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga sed perspiciatis facere aperiam quia, aspernatur nam voluptate quibusdam cum dolorum placeat debitis ipsum mollitia laudantium nostrum voluptates. Architecto, perspiciatis odio?
      </div>
    </div>
  )
}
