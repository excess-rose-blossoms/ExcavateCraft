# README: Term Project

### Stuff We Did
#### **First person movement system:** 
Pretty much redone from scratch. Includes:
  - Checks for collisions
  - Jumping
  - The ability to look around just by moving the mouse in a manner just like the original Minecraft
  - The ability to mine blocks by clicking on them
  - The ability to place a selected block

Harder than it looks since in the simplest approach, the movement direction would be dependent on the pitch, roll, and yaw, but in order to be faithful (and not nauseating), it needs to be independent on the pitch and roll BUT dependent on the yaw. Math (ew) had to be done to do this, as well as separating the camera transform into separate matrices. Even more work had to be done to do raycasts to check for collisions as well as to see what blocks the player was looking at when they clicked the mouse.

#### **Gorgeous randomly generated landscape:** 
Rolling hills, plains, and beautiful trees (brush patterns also randomly generated) generated using Perlin noise. Landscape is made up of different blocks, with grass on the surface, and stone and bedrock under it. 

#### **Game doesn't make computer explode:** 
Includes: Self-balancing binary search tree, hash map, frustum culling. Took the AVL code from an online source, referenced in bbtree.js. These data structures ensure quick lookups of blocks when needed (say for deleting a block on click). Frustrum culling ensures not all blocks are rendered uselessly. Harder than it seems because of the math (yuck), which checks if the block is inside the view frustrum. We also split the world into chunks. Each chunk is created as a unit. Chunks are stored and loaded from local storage as necessary (depending on where the user is standing). All of this is reasonably challenging as it involves the usage of two data structures along with chunking, which is itself a store of individual blocks. Also had to deal with efficiently encoding the data to be stored. 

### Member contributions
-**Benjamin Koh (204916073):** First person movement system

-**Shree Kesava Narayan Prasanna (004973979):** Basic code for frustrum culling, chunking, hash table, incorporating avl tree. (Robert Geil improved upon these).

-**Robert Geil (104916969):** Terrain generation through perlin noise, tree
generation through perlin noise, block textures and creation, block collisions (somewhat), a huge amount of performance and optimization, especially saving and loading chunks and rendering with the frustum.
