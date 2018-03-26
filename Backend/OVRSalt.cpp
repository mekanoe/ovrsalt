#include "stdafx.h"
#include "OVRSalt.h"
#include "utils.h"

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
		for (std::pair<std::string, Overlay*> prOverlay : m_mOverlays) {
			prOverlay.second->Shutdown();
		}

		vr::VR_Shutdown();
	}

	bool OVRSalt::StartOverlays(std::string &strOverlays) {
		if (strOverlays.length() == 0) {
			strOverlays = "UITest";
		}

		std::vector<std::string> vstrOverlays = SplitString(strOverlays, ',');

		for (std::string strOverlay : vstrOverlays) {
			StartOverlay(strOverlay);
		}

		return true;
	}

	bool OVRSalt::StartOverlay(const std::string strOverlay) {
		Overlay clOverlay = Overlay(strOverlay, m_pVRSystem);
		m_mOverlays.insert_or_assign(strOverlay, &clOverlay);
		m_mOverlayIPC.insert_or_assign(clOverlay.m_sIPCId, &clOverlay);

		std::cout << "** Starting " << strOverlay.c_str() << "..." << std::endl;

		return clOverlay.StartRenderer();
	}

	Overlay* OVRSalt::GetOverlay(const std::string name) {
		return m_mOverlays[name];
	}

	Overlay* OVRSalt::GetOverlayIPC(const std::string ipc) {
		return m_mOverlayIPC[ipc];
	}

}
