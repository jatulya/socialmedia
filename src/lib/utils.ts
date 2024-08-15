import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file)

//to display date as "Jul 25, 2023 at 2:30PM"
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", //year should be displayed as number
    month: "short", //month will be displayed as short string (Jan, Feb)
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);
  // the date object is converted to the mentioned option format, (ignores the time when converting and storing)

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;

  /* eg. datestring= "2023-07-25T14:30:00Z" then 
   output: "Jul 25, 2023 at 2:30 PM" */
}

//this function is for showing if the post was created a month ago, days ago or seconds ago.
export const multiFormatDateString = (timestamp: string = "") : string => {
  /* timestamp = 'YYYY-MM-DDHH-mm-ss-sssZ'
     colon used to denote the type of the variable, creates an object of Date
   */
  const date: Date = new Date(timestamp)
  const now: Date = new Date()  //current time
  
  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return `${Math.floor(diffInDays)} day ago`;
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `${Math.floor(diffInDays)} days ago`;
    case Math.floor(diffInHours) >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case Math.floor(diffInMinutes) >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
}

export const checkIsLiked = (likedlist: string[], userId: string) => {
  return likedlist.includes(userId)
}
/*
  (parametername: datatype1 = defaultvalue) => datatype2  -> this implies the function has optional parameter of a datatype1. if no value is given, the default value is passed as parameter, datatype2 is expected to be returned by the function is a string

  const being used in a function -> function reference can't be changed -> 
  in ts and js, fnctns are treated just like variables, which means the pointer to them can be changed. 
  changing a reference of function basically implies changing the code of the function
*/