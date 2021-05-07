# Plainlist 

Plainlist is a to-do and shopping-list app with full functionality but minimal bells and whistles, for people who just want a plain list app.

This repository is the code for a web-based front end, built in React.

## Deployment 

`yarn start`

## Structure

<pre>
Loading - loading message 
App - display all categories, including heading
  OneCat - one category, including heading
    OneList -one list, including heading
      AddItem - input form to add an itemName and itemNote 
      ItemsList - list of items, handles drag, reorder
        SortableItemItem - one item, handles delete and edit 
</pre>
