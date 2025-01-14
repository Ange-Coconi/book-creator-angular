import { Book, Folder, folderOrganisator, Item } from "../models";

const libraryData = [
    {
      title: "The Great Gatsby",
      content: "In my younger and more vulnerable years..."
    },
    {
      title: "1984",
      content: "It was a bright cold day in April..."
    },
    {
      title: "Pride and Prejudice",
      content: "It is a truth universally acknowledged..."
    },
    {
      title: "To Kill a Mockingbird",
      content: "When he was nearly thirteen..."
    },
    {
      title: "The Catcher in the Rye",
      content: "If you really want to hear about it..."
    },
    {
      name: "Classics",
      items: [
        {
          title: "Moby Dick",
          content: "Call me Ishmael..."
        },
        {
          title: "Don Quixote",
          content: "Somewhere in La Mancha..."
        },
        {
          title: "War and Peace",
          content: "Well, Prince, Genoa and Lucca..."
        }
      ]
    },
    {
      name: "Science Fiction",
      items: [
        {
          title: "Dune",
          content: "In the week before their departure..."
        },
        {
          title: "Foundation",
          content: "HARI SELDON — ... born in the..."
        },
        {
          title: "Neuromancer",
          content: "The sky above the port..."
        }
      ]
    },
      {
      name: "Mystery",
      items: [
          {
              title: "The Maltese Falcon",
              content: "Samuel Spade's jaw was long..."
          },
          {
              title: "The Big Sleep",
              content: "It was about eleven o'clock..."
          },
          {
              title: "Gone Girl",
              content: "When I think of my wife..."
          }
      ]
  },
  {
      name: "Fantasy",
      items: [
          {
              title: "The Hobbit",
              content: "In a hole in the ground..."
          },
          {
              title: "A Game of Thrones",
              content: "We should start back..."
          },
          {
              title: "The Name of the Wind",
              content: "It was night again..."
          }
      ]
  },
  {
      name: "Contemporary",
      items: [
          {
              title: "The Alchemist",
              content: "The boy's name was Santiago..."
          },
          {
              title: "The Kite Runner",
              content: "I became what I am today..."
          },
          {
              title: "Life of Pi",
              content: "My suffering left me sad..."
          }
      ]
  }
  ];
  
export const library: folderOrganisator = {
  books: [],
  folders: []
};

libraryData.forEach(itemData => {
  if (itemData.name) {
    const folder = new Folder(itemData.name, 'root');
    const items = itemData.items.map(childItem => {
      return new Book(childItem.title, folder)
    })
    folder.addBooks(items);
    library.folders.push(folder);
  } else if (itemData.title) {
    const book = new Book(itemData.title, 'root');
    library.books.push(book)
  }
  });
