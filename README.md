# OVRSalt

a very very very very WIP OpenVR overlay system using React + Pixi.JS.

## Goals

In very short order, I want to render React components into OpenVR overlays, both regular and dashboard ones, ideally multiple at the same time, headlessly. This means avoiding Electron and other similar tools. CEF or other full DOM implementations are a **last resort**.

The biggest implementation detail is how to get things traditionally done in the browser to end up in a game.. but never actually using a web browser. I'm thinking this can be done in one of two ways, given that I could produce a proper texture from the Pixi.JS renderer (which I'm sure I can.)

- **Option 1**: Make a NAN module for the D3D11 + IVROverlay work. This is possibly harder than I'd like to take on.
- **Option 2**: Make a C# runner via ChakraCore and the regular OpenVR SDK C# path. This is probably easiest.

The other thing of note is that this *must* be easy to develop for, ideally in a browser. I do not want to make a custom renderer or react-native platform, this is too much work, and doesn't interest me. I basically want to write overlays on my Macbook without a VR HMD in my hands, but still have the exact same experience when I put one on.

The OpenVR renderer will only work on Windows, but as many components as possible should remain intact for speedy overlay development in the browser.