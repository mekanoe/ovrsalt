#pragma once
#include "stdafx.h"
#include "Overlay.h"

namespace ovrsalt {

	class OVRSalt {
		// VRSystem
		vr::IVRSystem *m_pVRSystem;

		// overlays mapped by name
		std::map<std::string, Overlay*> m_mOverlays;

		// overlays mapped by IPC
		std::map<std::string, Overlay*> m_mOverlayIPC;

	public:
		OVRSalt();
		~OVRSalt();
		bool StartVR();
		void Shutdown();

	};


}
