import {Client,Databases,Query,ID} from "appwrite"

const DATABASE = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);
export const Update_Search_Count = async (searchTerm,movie) => {
    try{
        const result =await database.listDocuments(DATABASE,TABLE,[
            Query.equal('searchTerm',searchTerm),
        ])
        if(result.documents.length>0)
        {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE,TABLE,doc.$id,{
                count:doc.count+1,
            })
        }
        else{
            await database.createDocument(DATABASE,TABLE,ID.unique(),{
                searchTerm,
                count:1,
                poster_url:`https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                movie_id:movie.id,
            })
        }
    }
    catch(error)
    {
        console.log(error);
    }
}
export const getTrendingMovies = async ()=>{
    try{
        const result = await database.listDocuments(DATABASE,TABLE,[
            Query.limit(5),
            Query.orderDesc("count"),

        ])
        return result.documents;
    }
    catch(error)
    {
        console.log(error);
    }
}