<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Proxy\Exception\InvalidArgumentException;

/** @ORM\Entity */
class Service {
    
    const TYPE_OTRS = "otrs";
    
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255) */
	protected $company;
	
	/** @ORM\Column(type="string", length=255) */
	protected $type;
	
	/** @ORM\Column(type="string", length=255) */
	protected $url;
	
	/** @ORM\Column(type="string", length=255) */
	protected $username;
	
	/** @ORM\Column(type="string", length=255) */
	protected $password;
	
	/** @ORM\Column(type="string", length=255) */
	protected $workspace;
	
	
	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }
    
    public function getCompany(){
    	return $this->company;
    }
    
    public function setCompany($company){
    	$this->company = $company;
    }
    
    public function getType(){
    	return $this->type;
    }
    
    public function setType($type){
        if (!in_array($type, [self::TYPE_OTRS])) {
        	throw new InvalidArgumentException("Invalid type");
        }
    	$this->type = $type;
    }
    public function getUrl(){
    	return $this->url;
    }
    
    public function setUrl($url){
    	$this->url = $url;
    }
    public function getUsername(){
    	return $this->username;
    }
    
    public function setUsername($username){
    	$this->username = $username;
    }
    public function getPassword(){
    	return $this->password;
    }
    
    public function setPassword($password){
    	$this->password = $password;
    }
    
    public function getWorkspace(){
    	return $this->workspace;
    }
    
    public function setWorkspace($workspace){
    	$this->workspace = $workspace;
    }
}