# README: Term Project

### Stuff We Did
#### **First person movement system:** 
Pretty much redone from scratch. Includes:
  - Checks for collisions
  - Jumping
  - The ability to look around just by moving the mouse in a manner just like the original Minecraft
  - The ability to mine blocks by clicking on them

Harder than it looks since in the simplest approach, the movement direction would be dependent on the pitch, roll, and yaw, but in order to be faithful (and not nauseating), it needs to be independent on the pitch and roll BUT dependent on the yaw. Math (ew) had to be done to do this, as well as separating the camera transform into separate matrices. Even more work had to be done to do raycasts to check for collisions as well as to see what blocks the player was looking at when they clicked the mouse.

#### **Gorgeous randomly generated landscape:** 
Rolling hills, plains, and beautiful trees (brush patterns also randomly generated) generated using Perlin noise. Landscape is made up of different blocks, with grass on the surface, and stone and bedrock under it. 

#### **Game doesn't make computer explode:** 
Includes: Self-balancing binary search tree, hash map, frustum culling.

Member contributions:
Benjamin Koh- First person movement system
