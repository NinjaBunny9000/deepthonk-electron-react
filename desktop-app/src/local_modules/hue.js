import { v3 as hue } from 'node-hue-api';
// import { logger as log, logDemo } from './loggyboi';

async function discoverBridgeIP(timeout) {
    const discoveryResults = await hue.discovery.upnpSearch(timeout);
    if (discoveryResults.length === 0) {
      console.log('Failed to resolve any Hue Bridges');
      return null;
    } else {
      // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
      return discoveryResults[0].ipaddress;
    }
}

async function discoverAndCreateUser(appName, deviceName, timoutMS=10000) {
    const ipAddress = discoverBridgeIP(timout)
    console.log('ipaddress of bridge', ipAddress);

    // Create an unauthenticated instance of the Hue API so that we can create a new user
    const unauthenticatedApi = await hue.api.createLocal(ipAddress).connect();

    let createdUser;
    try {
        createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);
        console.log('*******************************************************************************\n');
        console.log('User has been created on the Hue Bridge. The following username can be used to\n' +
                    'authenticate with the Bridge and provide full local access to the Hue Bridge.\n' +
                    'YOU SHOULD TREAT THIS LIKE A PASSWORD\n');
        console.log(`Hue Bridge User: ${createdUser.username}`);
        console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
        console.log('*******************************************************************************\n');

        // Create a new API instance that is authenticated with the new user we created
        const authenticatedApi = await hue.api.createLocal(ipAddress).connect(createdUser.username);

        // Do something with the authenticated user/api
        const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
        console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);

    } catch(err) {
        if (err.getHueErrorType() === 101) {
            console.log('The Link button on the bridge was not pressed. Please press the Link button and try again.');
        } else {
            console.log(`Unexpected Error: ${err.message}`);
        }
    }
}

/// debug/dev tools


function listLights(ip, user) {
    hue.api.createLocal(ip).connect(user)
        .then(api => {
            console.log('Connected to Hue API');
            // list each light's id and name
            api.lights.getAll()
                .then(lights => {
                    lights.forEach(light => {
                        console.log(`${light.data.id} - ${light.data.name}`);
                    });
                });
        });
}


// make a class called HueInterface
class HueFacade {
    constructor(ip, user, lights) {
        this.ip = ip;
        this.user = user;
        this.lights = lights;
    }

    async getAPI() {
        return await hue.api.createLocal(this.ip).connect(this.user);
    }

    async changeColors(color, brightness) {
        const api = await this.getAPI();
        this.lights.forEach(async light => {
            const result = await api.lights.setLightState(light, { on: true, brightness: brightness, xy: color });
            console.log(`Was state change successful? ${ result }`);
        });
    }

    async setLightState(state) {
        const api = await this.getAPI();
        this.lights.forEach(async light => {
            const result = await api.lights.setLightState(light, {on: state})
            console.log(`Was light ${light} changed successfully to ${state}? ${result}`);
        });
    }

    async getLightDetails(lightId) {
        const api = await this.getAPI();
        const result = await api.lights.getLight(lightId);
        console.log(result.toStringDetailed());
    }

    async getLightState(lightId) {
        const api = await this.getAPI();
        const result = await api.lights.getLightState(lightId);
        console.log(JSON.stringify(result, null, 2));
    }


}

export { HueFacade, discoverBridgeIP, discoverAndCreateUser, listLights };
