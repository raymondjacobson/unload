-(void)requestProjects
{
   NSString *preparedString = [NSString stringWithFormat:@"%@ %@", @"go", @"here"];
   NSDictionary *jsonDict = [NSDictionary dictionaryWithObject:preparedString forKey:@"request"];
   
   NSString *jsonRequest = [jsonDict JSONRepresentation];
   NSLog(@"jsonRequest is %@", jsonRequest);
   
   NSURL *url = [NSURL URlWithString:@"http://x"];
   
   NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy: NSURLRequestUseProtocolCachePolicy timeoutInterval:60.0];
   
   NSData *requestData = [NSData dataWithBytes:[jsonRequest UTF8String] length:[jsonRequest length]];
   
   
   [request setHTTPMethod:@"POST"];
   [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
   [request setValue:@"aplication/json" forHTTPHeaderField:@"Content-Type"];
   [request setValue:[NSString stringWithFormat:@"%d", [requestData length]] forHTTPHeaderField:@"Content-Length"];
   [request setValue:jsonRequest forHTTPHeaderField:@"Query-string"];
   //set the data prepared
   [request setHTTPBody: requestData];
   
   //Initialize the connection with request
   NSURLConnection *connection = [[NSURLConnection alloc]initWithRequest:request delegate:self];
   //Start the connection
   [delegate showIndicator];
   [connection start];
   
}


//delegate methods:

//METHODS TO HANßDLE RESPONSE
#pragma mark NSURLConnection delegate methods
//WHen receiving the response
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response {
   
   NSLog(@" Did receive respone");
   [responseData setLength:0];
   
   
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
   //While receiving the response data
   [responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error {
   //When failed just log
   [delegate hideIndicator];
   NSLog(@"Connection failed!");
   NSLog(@"Error %@", error);
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection {
   //When the response data is downloaded
   // NSLog(@" Data obtained %@", responseData);
   NSString *responseString = [[NSString alloc] initWithData:responseData encoding:NSUTF8StringEncoding];
   // NSLog(@" Response String %@", responseString);
   //converted response json string to a simple NSdictionary
   //If the response string is really JSONABLE I will have the data u sent me displayed succefully
   
   NSMutableArray *results = [responseString JSONValue];
   NSLog(@"Response: %@", results);
   /// la la al alal alaa
}

   
}