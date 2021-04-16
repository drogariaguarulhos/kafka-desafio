import {Router} from 'express';

const routes = Router();

routes.post("/certifications", async (req, res) => {
  const { id, name, course , grade} = req.body;
    //Chamar micro serviço
    const message = {
        user: { id, name },
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
      })  
      return res.json(response);
});


export default routes;