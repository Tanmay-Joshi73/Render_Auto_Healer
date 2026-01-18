import { Injectable, BadRequestException } from '@nestjs/common';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'net';
import { RenderClient } from 'src/render/render.client';
import { randomUUID } from 'crypto';
import { DatabaseService } from 'src/database/database.service';
import { Type } from '@nestjs/common';
import { Console, error } from 'console';
@Injectable()

export class ServicesService {

  constructor(private readonly client: RenderClient,
    private readonly DB: DatabaseService

  ) { }

  // 1️⃣ List available Render services for the user
  async listAvailableServices(renderApiKey: string) {
    if (!renderApiKey) {
      throw new BadRequestException('API key is not provided');
    }

    const services = await this.client.verifyService(renderApiKey);
    console.log(services)
    if (!services) {
      throw new BadRequestException('Invalid Render API key');
    }

    // UI-safe mapping (optional)
    return services.map((service: any) => ({
      renderServiceId: service.id,
      name: service.name,
      type: service.type,
      status: service.status,
      dashboardUrl: service.dashboardUrl,
      updatedAt: service.updatedAt,
    }));
  }

  //This will return the Specified service name
  async getServiceByName(renderApiKey: string, serviceName: string) {
    if (!renderApiKey) {
      throw new BadRequestException('API key is not provided');
    }
    if (!serviceName) {
      throw new BadRequestException('Service name is required');
    }

    const service = await this.client.getWebServiceByName(
      renderApiKey,
      serviceName,
    );

    if (!service) {
      throw new BadRequestException('Service with this name not found');
    }

    return service; // FULL object
  }




  // This will return the unehalty service or which are suspened by any reason
  async listUnhealthyServices(renderApiKey: string) {
    if (!renderApiKey) {
      throw new BadRequestException('API key is not provided');
    }

    const services = await this.client.verifyService(renderApiKey);
    console.log(services)
    return services.filter(
      (service: any) =>
        service.type === 'web_service' &&
        ['failed', 'crashed'].includes(service.status),
    );
  }

  //This will group all the services by states
  async getServiceOverview(renderApiKey: string) {
    if (!renderApiKey) {
      throw new BadRequestException('API key is not provided');
    }

    const services = await this.client.verifyService(renderApiKey);
    console.log(services)
    if (!services) {
      throw new BadRequestException('Invalid Render API key');
    }

    return {
      total: services.length,
      active: services.filter(s => s.suspended === 'not_suspended'),
      suspended: services.filter(s => s.suspended === 'suspended'),
      unhealthy: services.filter(s =>
        ['failed', 'crashed'].includes(s.status),
      ),
    };
  }
  //This will Redeploy the service 
  async redeployService(renderApiKey: string, ServiceName: string) {
    if (!renderApiKey) {
      throw new BadRequestException('API key is not provided');
    }
    if (!ServiceName) {
      throw new BadRequestException('Service Name is required');
    }

    //This will give the whole details of the services that can agian use to find the service id and then re-deploy it.
    const serviceDetails = await this.getServiceByName(renderApiKey, ServiceName)
    const serviceId = serviceDetails.id
    const result = await this.client.redeployService(renderApiKey, serviceId)
    return result;

    // return "hey work is done bro"


    // if (!result) {
    //   throw new BadRequestException('Failed to redeploy service');
    // }

    // return {
    //   message: 'Service redeployment triggered successfully',
    //   serviceId,
    // };
  }




  async createUptimeService(RenderApiKey: string, ServiceName: string,userId:string) {
   
    if (!ServiceName) {
      throw new BadRequestException('Service Name is required');
    }

    const supa = await this.DB['pool'].connect();

    // This will return the service id by checking the service name of the services
    const service = await this.getServiceByName(RenderApiKey, ServiceName); //Store in DB

    if (!service) throw new BadRequestException("Given service is now present ")

      
      
      // 2️⃣ Insert deployment
      try{
      await supa.query('BEGIN')
    // Before inserting check weather the current deploymen present in the system or not 
    const ExistingDeployment = await supa.query(
      `
      SELECT * FROM deployment where Deployment_name=$1 
      `, [ServiceName]
    )

    // Here first insert Deployment data into the system;
    const deploymentRes = await supa.query(
      `
      INSERT INTO deployment(deployment_name, type)
      VALUES ($1, $2)
      RETURNING id,type
      `,
      [service.name, service.type],
    );
    let deptId: string = '';


    // THis will extract the data of the deployment;
   
    deploymentRes.rows.forEach((ele): any => {
      
      deptId = ele.id;

    })


    // This create the web hook token in the DB
    const webHookToken = `whk_${randomUUID()}`  ///This will be create by any type of crypto 

    const tokenRes = await supa.query(
      `
    INSERT INTO TOKEN(token)
    VALUES($1)
    RETURNING id
    `,
      [webHookToken]
    )

    let tokenId: string = '';
    tokenRes.rows.forEach((ele): any => {
      tokenId = ele.id;
    })


    //Now the whole mapping table;
    const token_deployment = await supa.query(
      `
      INSERT INTO token_deployment_mapping(dept_id,token_id)
      VALUES ($1,$2)
      RETURNING id
    `,
      [deptId, tokenId]
    )

    ///Now insert the Data in the token_mapping table;
    const user_token_mapping=await supa.query(
      `
      INSERT INTO users_token_mapping(user_id, token_id) VALUES ($1, $2);

      `,
      [userId,tokenId]
    )
    ///Final stage i
      // s to commit all the data in to the database at a time
    await supa.query('COMMIT')
    return {
      Status:true,
      Message:"Monitor successfully created",
      serviceName:ServiceName,
      webHookUrl:`services/monitor/${webHookToken}`

    }
  }
  catch(err){
    await supa.query('ROLLBACK')
    throw err
  }
  finally{
  await  supa.release()

  }
}



  //This will check the request or web event from the UptimeRobot
  async Monitor(tokenid: string): Promise<any> {
  if (!tokenid) {
    throw new BadRequestException('Token is required');
  }

  // ✅ Fetch deployment + render_api_key using mapping
  const result = await this.DB.query(
    `
    SELECT 
      u.render_api_key,
      d.deployment_name
    FROM tokens t
    JOIN users_token_mapping utm 
      ON utm.token_id = t.id
    JOIN users u 
      ON u.id = utm.user_id
    JOIN token_deployment_mapping tdm 
      ON tdm.token_id = t.id
    JOIN deployments d 
      ON d.id = tdm.deployment_id
    WHERE t.token = $1
    LIMIT 1
    `,
    [tokenid],
  );

  if (result.length === 0) {
    throw new BadRequestException('Invalid token or mapping not found');
  }

  const { render_api_key: renderApiKey, deployment_name: serviceName } = result[0];

  // ✅ Redeploy
  const redeployResult = await this.redeployService(renderApiKey, serviceName);

  return {
    status: true,
    message: 'Redeploy triggered successfully',
    serviceName,
    redeploy: redeployResult,
  };
}




  //This will Return the list of all WebHook created for that user
  async getAllWebhookUrls(userId: string) {
    console.log(userId)
    const data = await this.DB.query(
    `
    SELECT 
      t.token,
      d.deployment_name,
      d.type,
      t.created_at
    FROM users_token_mapping utm
    JOIN token t
      ON t.id = utm.token_id
    JOIN token_deployment_mapping tdm
      ON tdm.token_id = t.id
    JOIN deployment d
      ON d.id = tdm.dept_id
    WHERE utm.user_id = $1
    ORDER BY t.created_at DESC
    `,
    [userId],
  );
  
  return data.map((row: any) => ({
    token: row.token,
    webhookUrl: `services/monitor/${row.token}`,
    deploymentName: row.deployment_name,
    type: row.type,
    createdAt: row.created_at,
  }));
}



}
