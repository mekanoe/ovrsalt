#pragma once
#include <windows.h>
#include "utils.h"

namespace ovrsalt {

	class Overlay {
	
	public:
		Overlay(std::string sName, vr::IVRSystem *pVRSystem);
		~Overlay();
		void Shutdown();
		void PipeListener(HANDLE pipe);
		void StartIPC();
		std::string m_sIPCId = GenerateID();
		std::string m_sName;
		vr::VROverlayHandle_t m_overlayHandle = vr::k_ulOverlayHandleInvalid;

		bool StartRenderer();

	private:
		HANDLE m_hRendererHandle;
	};

}


