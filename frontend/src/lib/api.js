const API_BASE_URL ='http://localhost:5000/api';

export async function apiRequest(endpoint, options ={})
{
    const token =
    typeof window !='undefined'  //next.js works on browsers 
    ? localStorage.getItem('token')
    :null;
   
    const headers = {
        'Content-Type' : 'application/json', // fronted == json data 
        ...(token ? {Authorization:`Bearer ${token}`}: {}),
        ...options.headers  // spread operator
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`,
        {
          ...options,
          headers  
        }
    );
    const data = await response.json();  //converting response to json 

   if(!response.ok)
   {
    throw new Error(data.error || 'Something went wrong');
   }
return data;
}