#include "stdafx.h"
#include "Overlay.h"
#include <random>
#include <algorithm>
#include <windows.h>
#include <time.h>

namespace ovrsalt {

	int StringToWString(std::wstring &ws, const std::string &s)
	{
		std::wstring wsTmp(s.begin(), s.end());

		ws = wsTmp;

		return 0;
	}

	Overlay::Overlay(
		std::string sName,
		vr::IVRSystem *pVRSystem
	) : m_sName(sName) {}


	Overlay::~Overlay() {
		Shutdown();
	}

	void Overlay::Shutdown() {
		vr::VROverlay()->DestroyOverlay(m_overlayHandle);
	}

	bool Overlay::StartRenderer() {
		STARTUPINFO si;
		si.cb = sizeof(si);
		si.wShowWindow = HIDE_WINDOW;
		PROCESS_INFORMATION pi;

		std::wstring wsName;
		StringToWString(wsName, m_sName);

		std::wstring wsIPC;
		StringToWString(wsIPC, m_sIPCId);

		#ifdef _DEBUG
		std::wstring wsCmd = L"C:\\Program Files\\nodejs\\node.exe ..\\Runtime\\index.js";
		#else
		std::wstring wsCmd = L"..\\Runtime\\build\\bin\\OVRSaltRuntime.exe";
		#endif

		wsCmd = wsCmd + L" " + wsName + L" " + wsIPC;
		std::wcout << L"** Starting renderer process: " << wsCmd.c_str() << std::endl;

		if (!CreateProcess(NULL, LPWSTR(wsCmd.c_str()), NULL, NULL, FALSE, NULL, NULL, NULL, &si, &pi)) {
			std::cerr << "!! Render process failed to start! Code " << GetLastError() << std::endl;
			return false;
		}

		m_hRendererHandle = pi.hProcess;

		return true;
	}

	std::string Overlay::GenerateID() {
		srand(time(NULL));
		auto randchar = []() -> char {
			const char charset[] =
				"0123456789"
				"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
				"abcdefghijklmnopqrstuvwxyz";
			const size_t max_index = (sizeof(charset) - 1);
			return charset[rand() % max_index];
		};
		size_t length = 10;
		std::string str(length, 0);
		std::generate_n(str.begin(), length, randchar);
		return str;
	}

}