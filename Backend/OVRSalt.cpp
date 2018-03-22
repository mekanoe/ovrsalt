// Backend.cpp : Defines the entry point for the console application.
//

#include "stdafx.h"

using namespace vr;

int getShitToScreen() {
	vr::EVRInitError eInitError = vr::VRInitError_None;

	vr::IVRSystem *pVRSystem = vr::VR_Init(&eInitError, vr::VRApplication_Overlay);

	if (eInitError != vr::VRInitError_None) {
		std::cout << "init error: " << eInitError << std::endl;
		return eInitError;
	}



	return 0;
}

int main() {
	int exit = getShitToScreen();

	std::cin.ignore(); // exit on stuff.
	vr::VR_Shutdown();
	return exit;
}
