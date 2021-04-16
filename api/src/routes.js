import {Router} from 'express';
import {v4 as uuidV4} from 'uuid'
const routes = Router();

routes.post("/certifications", async (req, res) => {
  const { name, course , grade} = req.body;
  //Chamar micro serviço
  const message = {
      user: { id: uuidV4(), name },
      course,    
      grade,
  };

  const response = await req.producer.send({
      topic: 'test-topic',
      messages: [
        { 
          key: 'Certificate',
          value: JSON.stringify(message)
        },
      ],
    });  
    return res.json(response);
});


export default routes;