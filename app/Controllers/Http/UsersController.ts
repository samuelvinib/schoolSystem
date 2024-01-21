export default class UsersController {

    private request;
    private response;

    constructor(request, response){
        this.request = request;
        this.response = response;
    }

    public async routes(){

        const method:String = this.request.method();

        switch(method){
            case "GET":{
                return this.show();
            }
            case "POST":{
                return this.store();
            }
            case "PUT":{
                return this.update();
            }
            case "DELETE":{
                return this.destroy();
            }
            default: {
                this.response.status(405).json({
                    message: 'Method not allowed',
                });
            }
        }
    }

    private show(){
        return this.response.status(200).json({message:"get"});
    }
    
    private store(){
        return this.response.status(201).json({message:"post"});
    }

    private update(){
        return this.response.status(200).json({message:"put"});
    }

    private destroy(){
        return this.response.status(204).json({message:"delete"});
    }
}
