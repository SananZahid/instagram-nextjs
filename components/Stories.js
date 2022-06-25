import { faker } from '@faker-js/faker';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Story from './Story';

function Stories() {

  const [suggestions, setSuggestions] = useState([]);
  const { data: session } = useSession();

  useEffect( () => {
    const suggestions = [...Array(20)].map((_, i) => ({
    userId: faker.datatype.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    })
    );
    
    setSuggestions(suggestions);
  }, [])

  return (
    <div className='flex 
                    space-x-2 
                    p-6 
                    bg-white 
                    mt-8 
                    border-gray-200 
                    border 
                    rounded-sm 
                    overflow-x-scroll
                    scrollbar-thin 
                    scrollbar-thumb-black'>

        {session && (
          <Story img={session.user.image} name={session.user.username} />
        )}
        
        {suggestions.map((profile) => 
            (
              <Story  key={profile.userId} 
                      img={profile.avatar} 
                      name={profile.username}/>
            )
          )
        }
    </div>
  )
}

export default Stories