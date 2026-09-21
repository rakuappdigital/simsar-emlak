import Foundation
import Capacitor
import GameKit

/**
 * Minimal, in-target GameKit bridge — deliberately not a separate npm
 * package. The available Capacitor Game Center plugins on npm only ship a
 * CocoaPods podspec (mixed Swift/Objective-C sources in one SPM target,
 * which Swift Package Manager refuses to build), and this project is wired
 * for Capacitor's SPM integration, not CocoaPods. Three methods is all the
 * game currently needs (sign-in + unlock an achievement + show the native
 * achievements UI), so a small Swift-only CAPBridgedPlugin living directly
 * in the App target sidesteps the packaging problem entirely.
 */
@objc(GameCenterPlugin)
public class GameCenterPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "GameCenterPlugin"
    public let jsName = "GameCenter"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authenticate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "unlockAchievement", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "showAchievements", returnType: CAPPluginReturnPromise),
    ]

    @objc func authenticate(_ call: CAPPluginCall) {
        GKLocalPlayer.local.authenticateHandler = { [weak self] viewController, error in
            if let vc = viewController {
                DispatchQueue.main.async {
                    self?.bridge?.viewController?.present(vc, animated: true)
                }
                return
            }
            if let error = error {
                call.reject(error.localizedDescription)
                return
            }
            call.resolve(["authenticated": GKLocalPlayer.local.isAuthenticated])
        }
    }

    @objc func unlockAchievement(_ call: CAPPluginCall) {
        guard let achievementID = call.getString("achievementID") else {
            call.reject("achievementID is required")
            return
        }
        guard GKLocalPlayer.local.isAuthenticated else {
            call.resolve(["unlocked": false])
            return
        }
        let achievement = GKAchievement(identifier: achievementID)
        achievement.percentComplete = 100.0
        achievement.showsCompletionBanner = true
        GKAchievement.report([achievement]) { error in
            if let error = error {
                call.reject(error.localizedDescription)
            } else {
                call.resolve(["unlocked": true])
            }
        }
    }

    @objc func showAchievements(_ call: CAPPluginCall) {
        guard GKLocalPlayer.local.isAuthenticated else {
            call.reject("not authenticated")
            return
        }
        DispatchQueue.main.async { [weak self] in
            let gc = GKGameCenterViewController(state: .achievements)
            gc.gameCenterDelegate = self
            self?.bridge?.viewController?.present(gc, animated: true)
            call.resolve()
        }
    }
}

extension GameCenterPlugin: GKGameCenterControllerDelegate {
    public func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
        gameCenterViewController.dismiss(animated: true)
    }
}
