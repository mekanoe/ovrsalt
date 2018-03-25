#pragma once
#include <windows.h>

namespace ovrsalt {

	class Overlay {
	
	public:
		Overlay(std::string sName, vr::IVRSystem *pVRSystem);
		~Overlay();
		void Shutdown();
		std::string m_sIPCId = GenerateID();
		std::string m_sName;
		vr::VROverlayHandle_t m_overlayHandle = vr::k_ulOverlayHandleInvalid;

		bool StartRenderer();

	private:
		std::string GenerateID();
		HANDLE m_hRendererHandle;
	};

}


