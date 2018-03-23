
#include "stdafx.h"
#include <windows.h>
#include <Shlwapi.h>
#pragma comment(lib, "shlwapi.lib")
#include <random>
#include <algorithm>

using namespace vr;
using namespace std;

std::string GetWorkingDir() {
	char path[MAX_PATH] = "";
	GetCurrentDirectoryA(MAX_PATH, path);
	PathAddBackslashA(path);
	return path;
}

std::wstring randomString(size_t length) {
	auto randchar = []() -> char {
		const char charset[] =
			"0123456789"
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			"abcdefghijklmnopqrstuvwxyz";
		const size_t max_index = (sizeof(charset) - 1);
		return charset[rand() % max_index];
	};
	std::wstring str(length, 0);
	std::generate_n(str.begin(), length, randchar);
	return str;
}

std::string getTrackedDeviceString(vr::IVRSystem *pHmd, vr::TrackedDeviceIndex_t unDevice, vr::TrackedDeviceProperty prop)
{
	char buf[128];
	vr::TrackedPropertyError err;
	pHmd->GetStringTrackedDeviceProperty(unDevice, prop, buf, sizeof(buf), &err);
	if (err != vr::TrackedProp_Success)
	{
		return std::string("Error Getting String: ") + pHmd->GetPropErrorNameFromEnum(err);
	}
	else
	{
		return buf;
	}
}

void outputHMDInfo(std::string display, std::string driver) {
	std::string identity = driver;
	if (driver == "oculus") {
		identity = "Oculus Rift";
	}

	identity = identity + " (" + display + ")";

	std::cout << "Device: " << identity.c_str() << std::endl;
}

void matrix(vr::HmdMatrix34_t *pMatrix) {
	pMatrix->m[0][0] = 1.f;
	pMatrix->m[0][1] = 0.f;
	pMatrix->m[0][2] = 0.f;
	pMatrix->m[0][3] = 0.f;
	pMatrix->m[1][0] = 0.f;
	pMatrix->m[1][1] = 1.f;
	pMatrix->m[1][2] = 0.f;
	pMatrix->m[1][3] = 0.f;
	pMatrix->m[2][0] = 0.f;
	pMatrix->m[2][1] = 0.f;
	pMatrix->m[2][2] = 1.f;
	pMatrix->m[2][3] = 0.f;
}

bool checkOverlayError(vr::VROverlayError err, const char *state) {
	if (err != vr::VROverlayError_None) {
		std::cout << "overlay error :: " << state << ": " << vr::VROverlay()->GetOverlayErrorNameFromEnum(err) << std::endl;
		return false;
	}

	return true;
}

int renderProcess(vr::IVRSystem *pVRSystem, vr::VROverlayHandle_t *hOverlay) {
	
	std::wstring sPipeName = randomString(10);
	std::wstring sArgs = L"UITest " + sPipeName;
	std::wstring sPath = L"..\\Runtime\\build\\bin\\OVRSaltRuntime.exe";

	wcout << "Starting: " << sPath.c_str() << " " << sArgs.c_str() << endl;

	HINSTANCE nProcessOk = ShellExecute(NULL, NULL, sPath.c_str(), sArgs.c_str(), NULL, SW_HIDE);
	if (int(nProcessOk) <= 32) { 
		printf("Create process failed (%d).\n", GetLastError());
		return 1;
	}

	cout << "waiting..." << endl;
	
	return 0;
}

int getShitToScreen() {
	vr::EVRInitError eInitError = vr::VRInitError_None;

	vr::IVRSystem *pVRSystem = vr::VR_Init(&eInitError, vr::VRApplication_Overlay);

	if (eInitError != vr::VRInitError_None) {
		std::cout << "init error: " << eInitError << std::endl;
		return eInitError;
	}

	std::string sVRDriver = getTrackedDeviceString(pVRSystem, vr::k_unTrackedDeviceIndex_Hmd, vr::Prop_TrackingSystemName_String);
	std::string sVRDisplay = getTrackedDeviceString(pVRSystem, vr::k_unTrackedDeviceIndex_Hmd, vr::Prop_SerialNumber_String);

	outputHMDInfo(sVRDisplay, sVRDriver);

	if (vr::VROverlay()) {
		std::string sKey = std::string("ovrsalt.test");
		vr::VROverlayHandle_t hOverlay;
		vr::VROverlayError eOverlayError = vr::VROverlay()->CreateOverlay(sKey.c_str(), sKey.c_str(), &hOverlay);
		if (!checkOverlayError(eOverlayError, "create")) {
			return 1;
		}

		std::cout << "Overlay ready." << std::endl;

		// TODO: this isn't really great.
		std::string sOverlayFile = GetWorkingDir() + std::string("\\..\\fixtures\\qtqtqtq.png");

		eOverlayError = vr::VROverlay()->SetOverlayFromFile(hOverlay, sOverlayFile.c_str());
		if (!checkOverlayError(eOverlayError, "set texture")) {
			return 1;
		}

		vr::TrackedDeviceIndex_t hand = pVRSystem->GetTrackedDeviceIndexForControllerRole(vr::TrackedControllerRole_LeftHand);

		vr::HmdMatrix34_t pMatrix;
		matrix(&pMatrix);
		eOverlayError = vr::VROverlay()->SetOverlayTransformTrackedDeviceRelative(hOverlay, hand, &pMatrix);
		if (!checkOverlayError(eOverlayError, "set transform")) {
			return 1;
		}

		eOverlayError = vr::VROverlay()->SetOverlayWidthInMeters(hOverlay, 0.5);
		if (!checkOverlayError(eOverlayError, "set width")) {
			return 1;
		}

		eOverlayError = vr::VROverlay()->ShowOverlay(hOverlay);
		if (!checkOverlayError(eOverlayError, "show overlay")) {
			return 1;
		}

		std::cout << "Overlay should work. Let's start the runtime thread." << std::endl;
		renderProcess(pVRSystem, &hOverlay);
	}



	return 0;
}

int main(int argc, char **argv) {
	std::cout
		<< "=====================" << std::endl
		<< "Starting OVRSalt Test" << std::endl
		<< "=====================" << std::endl
		<< "Working dir: " << GetWorkingDir().c_str() << std::endl
		<< std::endl;

	int exit = getShitToScreen();

	std::cin.ignore(); // exit on stuff.
	vr::VR_Shutdown();
	return exit;
}
