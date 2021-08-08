# Cross It Off the List - details

## Basic UI and structure

The app runs on a fairly simple database with a three-level hierarchy:

- categories
- lists
- items

The main UI components are lists of categories, lists of lists and lists of items.  Operations include the usual add/rename/delete functions at each level.  You can also move a list to a different category.

When you set up a new account, you are provided with two default categories ('to do' and 'shopping') and two default lists, any or all of which you can edit or delete.

## Sortable lists

I used the @dnd-kit package to implement sortable lists, so users could sort their lists via drag and drop operations.  These also work on touch screens.  To implement this, all item, list and category records have a 'sortOrder' field.  New records will be assigned a sort order of Max(sortOrder)+1, so they will sort to the top.  Reordering the records via drag and drop will renumber the sortOrder fields as appropriate.

## Flat hierarchy

For users who prefer a simpler flat hierarchy, there is an option for flat display:

- lists
- items

This can be toggled from the user settings screen.  In order to implement this, each list has a separate field called 'sortOrderFlat' so that flat lists of lists can be reordered separately from lists within each category.

When you add a new list in hierarchical mode, it will be added to the category that is  currently displayed.  However, in order to add a new list in flat mode, I needed to create a special "uncategorized" category.  This category is hidden when it is empty, so users who only use hierarchical mode will never see it.  Likewise, users who only use flat mode will also never see it, since they won't see any categories.

If you switch from flat mode to hierarchical mode after adding new lists, those lists will appear in the "uncategorized" category, although they can be easily moved to other categories.  The uncategorized category will always appear at the bottom of the list of categories, and it's not draggable, so its sort order will never change.

## UI - icon buttons

Coding for icons was getting messy, especially when I wanted to change an icon, so I made an IconButton component to centralize all icon construction tasks and standardize their appearance.  There are options for icons with and without labels, and of a few different sizes.  The icon buttons can also be disabled.

## UI - mobile devices

I use ordinary CSS media queries to determine screen layout.  In addition, I use the autofocus param to set the focus on input text boxes where appropriate, but this was distracting on mobile platforms (it would open the keyboard as soon as the screen appeared), so I use the 'react-device-detect' package to detect mobile devices.  I used inputProps in all TextFields to turn off autocapitalization.  

## UX - registration

I have set up an API endpoint to report whether a username already exists, and I check for existing usernames as the registering user is typing in their potential username, rather than waiting for them to submit the registration form.  (I debounce the input value of the Textfield and use useEffect to check the API when the debounced value changes.)

## To-do

- move flatMode to user Profile
- validate input more thoroughly
- track and show last list used
- copy list
- handle conditions for internet outage
- authenticate w/ third party service
- make a manual update button to resynchronize with API database
- handle recovery for other connectivity issues
- expand wide-desktop layout
- show recently completed items (for xx days)

## Done

- set up external django server
- category display with uncategorized always at bottom, hidden when empty
- flat list display
- make component for icons with labels
- move list to different category
- material UI text input w/ autofocus, escape key to cancel
- create initial default records for new user
- create user profile
- make favicons
- help page
