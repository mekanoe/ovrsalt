# Backend/Renderer Diary

This is kind of a brain dump so I can process my thoughts as I build. There's a lot going on that I don't have written down.

----

Looking at Option 2 first, I think it's more scalable.

Setting my ideal requirements immediately, but I'm flexible obviously.

- .NET Core (will cede for Standard/FW 4.5)
- ~~SharpDX~~ OpenGL. Maybe. I'm really 0% sure.
- ChakraCore (scripting Node-ChakraCore?)
- OpenVR C# SDK

I'm semi-scared this is the wrong way, but.. eh, whatever. I want to use Core so I can write code and test on my Mac. I don't need to render actual D3D, I imagine I could make a pluggable architecture, so if it's on Mac/Linux, it could spit out a useful image for me to test everything up to D3D with. 

If I am serious about this route, I may alternatively consider OpenGL C# bindings... wait that's honestly a good idea. I think.

Here's what I know right now, though: SharpDX supports Core, and FW 4.5 easily. ChakraCore does too. OpenVR SDK might. Probably does, though.

My current big unknown is how I might get things out of the JS engine and into D3D/OGL.

Y'know.

Okay, OpenGL is my current idea, at least while I'm on Mac.

----

OKAY GUESS WHAT

I've decided raw might be the way to go. My current focus is getting raw image data to work. I bet it's just floats per pixel, which PIXI *might* give me, if not, easy to convert or just data-uri dump it and decode it later.

...Nevermind. It needs a PvBuffer.. which what the what even is that. I want to avoid doing too much C++.. or do I?

----

Okay back to reality.

I'm thinking raw ChakraCore. I'm not sure if Node is necessary, given a good webpack build.. I think. ugh!

First things, first, though. Let's get any image up in VR.



