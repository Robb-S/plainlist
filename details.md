# Cross It Off the List - details

## Basic UI and structure

The app runs on a fairly simple database with a three-level hierarchy:

- categories
- lists
- items

The main UI components are lists of categories, lists of lists and lists of items.  Operations include the usual add/rename/delete functions at each level.  You can also move a list to a different category.

When you set up a new account, you are provided with two default categories ('todo' and 'shopping') and two default lists ('todo #1' and 'shopping #1'), which of course you can edit or delete.

## Sortable lists

I used the @dnd-kit package to implement sortable lists, so users could sort their lists via drag and drop operations.  These also work on touch screens.  To implement this, all item, list and category records have a 'sortOrder' field.  New records will be assigned a sort order or Max(sortOrder)+1, so they will sort to the top.  Reordering the records via drag and drop will renumber the sortOrder fields as appropriate.

## Flat hierarchy

For users that prefer a simpler flat hierarchy, there is an option for flat display:

- lists
- items

This can be toggled from the user settings screen.  In order to implement this, each list has a separate field called 'sortOrderFlat' so that flat lists of lists can be reordered separately from lists within each category.

When you add a new list in hierarchical mode, it will be added to the category that is  currently displayed.  However, in order to add a new list in flat mode, I needed to create a special "uncategorized" category.  This category is hidden when it is empty, so users who only use hierarchical mode will never see it.  Likewise, users who only use flat mode will also never see it, since they won't see any categories.

If you switch from flat mode to hierarchical mode after adding new lists, those lists will appear in the "uncategorized" category, although they can be easily moved to other categories.  The uncategorized category will always appear at the bottom of the list of categories, so its sort order will never change.

## UI - icon buttons

Coding for icons was getting messy, especially when I wanted to change an icon, so I made an IconButton component to centralize all icon construction tasks and standardize their appearance.  There are options for icons with and without labels.


## To-do

- create initial default records for new user
- expand user profile
- improve desktop layout
- validate input
- handle condition for no internet during initial fetch
- authenticate w/ third party service
- track and show last list used

## Done

- set up external django server
- category display with uncategorized always at bottom, hidden when empty
- flat list display
- make component for icons with labels
- move list to different category
- material UI text input w/ autofocus, escape key to cancel
