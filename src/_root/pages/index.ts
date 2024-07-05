export {default as Home} from './Home'

//{default as Home} imports the Home component and export it under different name (here, same name is being used)  
// used for importing multiples together   
export const sidebarLinks = [
    {
      imgURL: "/assets/icons/home.png",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/assets/icons/explore.png",
      route: "/explore",
      label: "Explore",
    },
    {
      imgURL: "/assets/icons/people.png",
      route: "/all-users",
      label: "People",
    },
    {
      imgURL: "/assets/icons/bookmark.png",
      route: "/saved",
      label: "Saved",
    },
    {
      imgURL: "/assets/icons/post.png",
      route: "/create-post",
      label: "Create Post",
    },
  ];
  
  export const bottombarLinks = [
    {
      imgURL: "/assets/icons/home.png",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/assets/icons/explore.png",
      route: "/explore",
      label: "Explore",
    },
    {
      imgURL: "/assets/icons/bookmark.png",
      route: "/saved",
      label: "Saved",
    },
    {
      imgURL: "/assets/icons/post.png",
      route: "/create-post",
      label: "Create",
    },
  ];