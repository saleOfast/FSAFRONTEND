const capitalizeFirstLetter = (str:string) => {
    return str?.charAt(0)?.toUpperCase() + str?.slice(1);
  };
  

  function capitalizeSubstring(name:string) {
    return name?.replace(/\b\w/g, (match) => match?.toUpperCase());
  }

  export  {
    capitalizeFirstLetter, 
    capitalizeSubstring
  };
  