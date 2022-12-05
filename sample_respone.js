{
  id: number;
  video: string;
  name: string;
  project: string;
  artist: string;
  artistUrl: string;
}
{
    id:string;
    version_number:number;
    project_details:{
        id:string;
        name:string;
        creator:{
            id:string;
            first_name:string;
            last_name:string;
        }
    }
    shot_details:{
        shot:{
            id:string;
            name:string;
            frame_count:number;
        }
    }
    delivery_details:{
        video:string
    }
}
{
    "result": [{
        "id": "061a4708-9da3-4ec0-be34-22a2b241a627",
        "version_number": 1,
        "project_details": {
            "id": "1dd96514-7a6e-43ac-bad5-58fdcafbfc0a",
            "name": "demo_23rd_nov",
            "creator": {
                "id": "f0c2ce91-4a58-456e-802a-fd773a2905bd",
                "first_name": "Client_User",
                "last_name": "",
                "email": "client.demo@thehotspring.com",
                "office": {
                    "id": "15d8edda-4072-4fbf-ba44-479d3d20bf92",
                    "name": "Client Demo HQ",
                    "company": {
                        "id": "077be441-8a15-4c29-b447-473866332493",
                        "profile": {
                            "company_name": "Client Demo",
                            "website": "http://client-demo.com"
                        }
                    }
                }
            }
        },
        "shot_details": {
            "shot": {
                "id": "48b7e26d-c01a-49cf-9850-0e19f706f429",
                "name": "RT_HS_SH18",
                "frame_count": 29
            },
            "vendor": {
                "id": "a21bd734-7ab8-4ffc-8a78-ac9a48d1c63d",
                "first_name": "Fivey One",
                "last_name": "Techy",
                "email": "catchall+uplift2@thehotspring.com",
                "office": {
                    "id": "a2c61d40-0691-476a-a542-edd27dc2ea2b",
                    "name": "Tech-Five New Delhi",
                    "company": {
                        "id": "3f43e54b-c911-4eaa-a250-54202fabca01",
                        "profile": {
                            "company_name": "Tech-Five",
                            "website": "https://tech-five.example.com"
                        }
                    }
                }
            }
        },
        "shot_comments": [{
            "id": "28a2b3ce-4f9d-4610-95d3-4210835d6540",
            "comment": "COMPLETE THERE\n",
            "attachments": [],
            "user": {
                "id": "a21bd734-7ab8-4ffc-8a78-ac9a48d1c63d",
                "first_name": "Fivey One",
                "last_name": "Techy",
                "email": "catchall+uplift2@thehotspring.com",
                "office": {
                    "id": "a2c61d40-0691-476a-a542-edd27dc2ea2b",
                    "name": "Tech-Five New Delhi",
                    "company": {
                        "id": "3f43e54b-c911-4eaa-a250-54202fabca01",
                        "profile": {
                            "company_name": "Tech-Five",
                            "website": "https://tech-five.example.com"
                        }
                    }
                }
            },
            "is_client_comment": false,
            "created": "2022-09-07T17:29:05.350875Z"
        }],
        "delivery_details": {}
    }, {
        "id": "f7f29f98-1946-42b0-be80-9545d2feaf14",
        "version_number": 2,
        "project_details": {
            "id": "1dd96514-7a6e-43ac-bad5-58fdcafbfc0a",
            "name": "demo_23rd_nov",
            "creator": {
                "id": "f0c2ce91-4a58-456e-802a-fd773a2905bd",
                "first_name": "Client_User",
                "last_name": "",
                "email": "client.demo@thehotspring.com",
                "office": {
                    "id": "15d8edda-4072-4fbf-ba44-479d3d20bf92",
                    "name": "Client Demo HQ",
                    "company": {
                        "id": "077be441-8a15-4c29-b447-473866332493",
                        "profile": {
                            "company_name": "Client Demo",
                            "website": "http://client-demo.com"
                        }
                    }
                }
            }
        },
        "shot_details": {
            "shot": {
                "id": "48b7e26d-c01a-49cf-9850-0e19f706f429",
                "name": "RT_HS_SH18",
                "frame_count": 29
            },
            "vendor": {
                "id": "a21bd734-7ab8-4ffc-8a78-ac9a48d1c63d",
                "first_name": "Fivey One",
                "last_name": "Techy",
                "email": "catchall+uplift2@thehotspring.com",
                "office": {
                    "id": "a2c61d40-0691-476a-a542-edd27dc2ea2b",
                    "name": "Tech-Five New Delhi",
                    "company": {
                        "id": "3f43e54b-c911-4eaa-a250-54202fabca01",
                        "profile": {
                            "company_name": "Tech-Five",
                            "website": "https://tech-five.example.com"
                        }
                    }
                }
            }
        },
        "shot_comments": [{
            "id": "28a2b3ce-4f9d-4610-95d3-4210835d6540",
            "comment": "COMPLETE THERE\n",
            "attachments": [],
            "user": {
                "id": "a21bd734-7ab8-4ffc-8a78-ac9a48d1c63d",
                "first_name": "Fivey One",
                "last_name": "Techy",
                "email": "catchall+uplift2@thehotspring.com",
                "office": {
                    "id": "a2c61d40-0691-476a-a542-edd27dc2ea2b",
                    "name": "Tech-Five New Delhi",
                    "company": {
                        "id": "3f43e54b-c911-4eaa-a250-54202fabca01",
                        "profile": {
                            "company_name": "Tech-Five",
                            "website": "https://tech-five.example.com"
                        }
                    }
                }
            },
            "is_client_comment": false,
            "created": "2022-09-07T17:29:05.350875Z"
        }],
        "delivery_details": {}
    }]
}