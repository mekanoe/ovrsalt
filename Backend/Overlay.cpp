#include "stdafx.h"
#include "Overlay.h"
#include "utils.h"
#include <random>
#include <algorithm>
#include <windows.h>
#include <time.h>
#include <thread>

namespace ovrsalt {

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

	void Overlay::PipeListener(HANDLE pipe) {
		bool bGotFirst = false;
		for (;;) {
			wchar_t wcBuf[1024];
			DWORD dwReadBytes = 0;
			BOOL result = ReadFile(
				pipe,
				wcBuf,
				1024 * sizeof(wchar_t),
				&dwReadBytes,
				NULL
			);

			if (!result) {
				continue;
			}

			if (!bGotFirst) {
				std::cout << "** Got a message, was " << dwReadBytes << "bytes" << std::endl;
				bGotFirst = true;
			}
		}
	}

	void Overlay::StartIPC() {

		std::wstring wsPipeName = L"\\\\.\\pipe\\ovrsalt\\" + StringToWString(m_sIPCId);

		HANDLE pipe = CreateNamedPipe(
			LPWSTR(wsPipeName.c_str()), 
			PIPE_ACCESS_INBOUND, 
			PIPE_TYPE_BYTE,
			1,
			0,
			0,
			0,
			NULL
		);

		if (pipe == NULL || pipe == INVALID_HANDLE_VALUE) {
			std::cerr << "Pipe creation error " << GetLastError() << std::endl;
			return;
		}
		
		PipeListener(pipe);
	}

	bool Overlay::StartRenderer() {
		std::thread tIPCPipe (&Overlay::StartIPC, this);
		tIPCPipe.detach();

		STARTUPINFO si;
		PROCESS_INFORMATION pi;

		ZeroMemory( &si, sizeof(si) );
		si.cb = sizeof(si);
		ZeroMemory( &pi, sizeof(pi) );

		si.wShowWindow = HIDE_WINDOW;

		std::wstring wsName = StringToWString(m_sName);

		std::wstring wsIPC = StringToWString(m_sIPCId);

		#ifdef _DEBUG
		std::wstring wsCmd = L"C:\\Program Files\\nodejs\\node.exe ..\\Runtime\\index.js";
		#else
		// TODO: make this path not bad
		std::wstring wsCmd = L".\\runtime\\bin\\OVRSaltRuntime.exe";
		#endif

		wsCmd = wsCmd + L" " + wsName + L" " + wsIPC;
		std::wcout << L"** Starting renderer process: " << wsCmd.c_str() << std::endl;

		if (!CreateProcess(NULL, LPWSTR(wsCmd.c_str()), NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi)) {
			std::cerr << "!! Render process failed to start! Code " << GetLastError() << std::endl;
			return false;
		}

		CloseHandle(pi.hThread);
		CloseHandle(pi.hProcess);

		std::cout << "++ Started " 
			<< m_sName.c_str() << " process." 
			<< std::endl;

		return true;
	}

}