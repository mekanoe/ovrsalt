#include "stdafx.h"
#include "OVRSalt.h"

namespace ovrsalt {

	OVRSalt::OVRSalt() {
	}


	OVRSalt::~OVRSalt() {

	}

	bool OVRSalt::StartVR() {
		vr::EVRInitError initError = vr::VRInitError_None;

		m_pVRSystem = vr::VR_Init(&initError, vr::VRApplication_Overlay);
		
		if (initError != vr::VRInitError_None) {
			std::string knownError = "(Unknown, see OpenVR docs or report this!)";
			if (initError == vr::VRInitError_Init_HmdNotFoundPresenceFailed) knownError = "(HMD not found, presence failed. Try null driver?)";

			printf("** OpenVR failed to init. Code %i %s", initError, knownError.c_str());

			return false;
		}

		return true;
	}

	// stop overlays, shutdown VR.
	void OVRSalt::Shutdown() {
		vr::VR_Shutdown();
	}

}
